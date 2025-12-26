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

const approveMemberRequest = async (
  user: IJwtPayload,
  memberId: string,
  payload: { status: MembershipStatus }
) => {
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
    data: payload,
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
      members: {
        where: {
          status: 'JOINED',
        },
      },
      _count: {
        select: {
          members: {
            where: { status: 'JOINED' },
          },
        },
      },
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

const changeOrganizationStatus = async (
  id: string,
  payload: { status: OrganizationStatus }
) => {
  const isExists = await prisma.organization.findUnique({
    where: { id },
  });

  if (!isExists) {
    throw new ApiError(status.NOT_FOUND, 'Organization not found');
  }

  return await prisma.organization.update({
    where: { id },
    data: { status: payload.status },
  });
};

const getAllOrganizationsByAdmin = async (
  params: any,
  options: IPaginationOptions
) => {
  const { page, skip } = calculatePagination(options);
  const limit = options.limit || 10;

  const andConditions: Prisma.OrganizationWhereInput[] = [];

  if (Object.keys(params).length > 0) {
    andConditions.push({
      AND: Object.keys(params).map((key) => ({
        [key]: { equals: params[key] },
      })),
    });
  }

  const whereConditions: Prisma.OrganizationWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.organization.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy: { createdAt: 'desc' },
    include: {
      _count: {
        select: {
          members: {
            where: { status: 'JOINED' },
          },
        },
      },
    },
  });

  const total = await prisma.organization.count({ where: whereConditions });

  return {
    meta: { page, limit, total },
    data: result,
  };
};

const getSingleOrganization = async (user: IJwtPayload, id: string) => {
  const organization = await prisma.organization.findUnique({
    where: { id },
    include: {
      campaigns: true,
      _count: {
        select: {
          members: {
            where: { status: 'JOINED' },
          },
        },
      },
    },
  });

  if (!organization) {
    throw new ApiError(status.NOT_FOUND, 'Organization not found');
  }

  const currentUserMembership = await prisma.member.findFirst({
    where: {
      organization_id: id,
      user_id: user.id,
    },
  });

  return {
    ...organization,
    membershipInfo: currentUserMembership
      ? {
          id: currentUserMembership.id,
          status: currentUserMembership.status,
          role: currentUserMembership.role,
        }
      : null,
  };
};

const getOrganizationMembers = async (
  user: IJwtPayload,
  organizationId: string
) => {
  const requester = await prisma.member.findFirst({
    where: {
      organization_id: organizationId,
      user_id: user.id,
      status: 'JOINED',
    },
  });

  if (
    !requester ||
    (requester.role !== 'ADMIN' && requester.role !== 'MODERATOR')
  ) {
    throw new ApiError(
      status.FORBIDDEN,
      'Access denied. Only admins or moderators can view the member list.'
    );
  }

  const result = await prisma.member.findMany({
    where: {
      organization_id: organizationId,
    },
    include: {
      user: {
        select: {
          id: true,
          phone: true,
          donor: {
            select: {
              name: true,
              address: true,
              contact_number: true,
              blood_group: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return result;
};

const updateMemberRole = async (
  user: IJwtPayload,
  memberId: string,
  payload: { role: MemberRole }
) => {
  const member = await prisma.member.findUnique({
    where: { id: memberId },
  });

  if (!member) {
    throw new ApiError(status.NOT_FOUND, 'Member not found');
  }

  const isAuthorized = await prisma.member.findFirst({
    where: {
      organization_id: member.organization_id,
      user_id: user.id,
      role: MemberRole.ADMIN,
      status: 'JOINED',
    },
  });

  if (!isAuthorized) {
    throw new ApiError(
      status.FORBIDDEN,
      'Only organization admins can change member roles'
    );
  }

  const result = await prisma.member.update({
    where: { id: memberId },
    data: { role: payload.role },
  });

  return result;
};

export const OrganizationService = {
  createOrganization,
  approveMemberRequest,
  getAllOrganizations,
  joinOrganization,
  leaveOrganization,
  getAllOrganizationsByAdmin,
  changeOrganizationStatus,
  getSingleOrganization,
  getOrganizationMembers,
  updateMemberRole,
};
