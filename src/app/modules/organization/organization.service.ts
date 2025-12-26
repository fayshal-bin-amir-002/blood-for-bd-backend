import {
  OrganizationStatus,
  MemberRole,
  MembershipStatus,
  Prisma,
} from '@prisma/client';
import status from 'http-status';
import { prisma } from '../../../shared/prisma';
import ApiError from '../../errors/ApiError';
import { IJwtPayload } from '../../../helpers/jwtHelpers';
import { IPaginationOptions } from '../../interfaces/pagination';
import { calculatePagination } from '../../../helpers/paginationHelper';

const createOrganization = async (user: IJwtPayload, payload: any) => {
  const isUserExists = await prisma.user.findUnique({
    where: { id: user.id },
  });

  if (!isUserExists || isUserExists.isBlocked) {
    throw new ApiError(status.FORBIDDEN, 'User is invalid or blocked!');
  }

  const result = await prisma.$transaction(async (tx) => {
    const organization = await tx.organization.create({
      data: {
        ...payload,
        admin_id: user.id,
        status: OrganizationStatus.PENDING,
      },
    });

    await tx.member.create({
      data: {
        user_id: user.id,
        organization_id: organization.id,
        role: MemberRole.ADMIN,
        status: MembershipStatus.JOINED,
      },
    });

    return organization;
  });

  return result;
};

const approveMemberRequest = async (user: IJwtPayload, memberId: string) => {
  const memberRequest = await prisma.member.findUnique({
    where: { id: memberId },
  });

  if (!memberRequest) throw new ApiError(status.NOT_FOUND, 'Request not found');

  const isAdmin = await prisma.member.findFirst({
    where: {
      organization_id: memberRequest.organization_id,
      user_id: user.id,
      role: MemberRole.ADMIN,
    },
  });

  if (!isAdmin)
    throw new ApiError(
      status.FORBIDDEN,
      'Only club admins can approve requests'
    );

  return await prisma.member.update({
    where: { id: memberId },
    data: { status: MembershipStatus.JOINED },
  });
};

const getAllOrganizations = async (
  params: any,
  options: IPaginationOptions
) => {
  const { page, skip } = calculatePagination(options);
  const limit = options.limit || 10;

  const andConditions: Prisma.OrganizationWhereInput[] = [
    { status: OrganizationStatus.APPROVED },
  ];

  if (Object.keys(params).length > 0) {
    andConditions.push({
      AND: Object.keys(params).map((key) => ({
        [key]: { contains: params[key], mode: 'insensitive' },
      })),
    });
  }

  const whereConditions: Prisma.OrganizationWhereInput = { AND: andConditions };

  const result = await prisma.organization.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy: { createdAt: 'desc' },
    include: {
      _count: { select: { members: true } },
    },
  });

  const total = await prisma.organization.count({ where: whereConditions });

  return {
    meta: { page, limit, total },
    data: result,
  };
};

const joinOrganization = async (user: IJwtPayload, organizationId: string) => {
  const isAlreadyMember = await prisma.member.findFirst({
    where: {
      user_id: user.id,
      organization_id: organizationId,
    },
  });

  if (isAlreadyMember) {
    throw new ApiError(
      status.BAD_REQUEST,
      'You already have a pending or active request'
    );
  }

  return await prisma.member.create({
    data: {
      user_id: user.id,
      organization_id: organizationId,
      status: MembershipStatus.PENDING,
      role: MemberRole.MEMBER,
    },
  });
};

const leaveOrganization = async (user: IJwtPayload, organizationId: string) => {
  const memberInfo = await prisma.member.findFirst({
    where: {
      user_id: user.id,
      organization_id: organizationId,
    },
  });

  if (!memberInfo) throw new ApiError(status.NOT_FOUND, 'Membership not found');
  if (memberInfo.role === MemberRole.ADMIN) {
    throw new ApiError(
      status.BAD_REQUEST,
      'Admins cannot leave without transferring ownership'
    );
  }

  return await prisma.member.delete({
    where: { id: memberInfo.id },
  });
};

export const OrganizationService = {
  createOrganization,
  approveMemberRequest,
  getAllOrganizations,
  joinOrganization,
  leaveOrganization,
};
