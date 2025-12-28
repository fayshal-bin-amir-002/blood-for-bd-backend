import { MemberRole, Prisma } from '@prisma/client';
import status from 'http-status';
import { prisma } from '../../../shared/prisma';
import ApiError from '../../errors/ApiError';
import { IJwtPayload } from '../../../helpers/jwtHelpers';
import { IPaginationOptions } from '../../interfaces/pagination';
import { calculatePagination } from '../../../helpers/paginationHelper';

const createCampaign = async (user: IJwtPayload, payload: any) => {
  const isMember = await prisma.member.findFirst({
    where: {
      organization_id: payload.organization_id,
      user_id: user.id,
      role: { in: [MemberRole.ADMIN, MemberRole.MODERATOR] },
    },
  });

  if (!isMember) {
    throw new ApiError(
      status.FORBIDDEN,
      'Only admins or moderators can create campaigns'
    );
  }

  const result = await prisma.campaign.create({
    data: payload,
  });

  return result;
};

const getAllCampaigns = async (params: any, options: IPaginationOptions) => {
  const { page, skip } = calculatePagination(options);
  const limit = options.limit || 10;

  const andConditions: Prisma.CampaignWhereInput[] = [];

  if (Object.keys(params).length > 0) {
    andConditions.push({
      AND: Object.keys(params).map((key) => ({
        [key]: { equals: params[key] },
      })),
    });
  }

  const whereConditions: Prisma.CampaignWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.campaign.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy: { createdAt: 'desc' },
    include: {
      organization: {
        select: {
          id: true,
          name: true,
          logo: true,
          division: true,
          district: true,
        },
      },
    },
  });

  const total = await prisma.campaign.count({ where: whereConditions });

  return {
    meta: { page, limit, total },
    data: result,
  };
};

const getCampaignsByOrganization = async (
  organizationId: string,
  options: IPaginationOptions
) => {
  const { page, skip } = calculatePagination(options);
  const limit = options.limit || 10;

  const result = await prisma.campaign.findMany({
    where: {
      organization_id: organizationId,
    },
    skip,
    take: limit,
    orderBy: { createdAt: 'desc' },
    include: {
      organization: {
        select: {
          id: true,
          name: true,
          logo: true,
          division: true,
          district: true,
        },
      },
    },
  });

  const total = await prisma.campaign.count({
    where: {
      organization_id: organizationId,
    },
  });

  return {
    meta: { page, limit, total },
    data: result,
  };
};

const deleteCampaign = async (user: IJwtPayload, id: string) => {
  const campaign = await prisma.campaign.findUnique({
    where: { id },
  });

  if (!campaign) throw new ApiError(status.NOT_FOUND, 'Campaign not found');

  const isAuthorized = await prisma.member.findFirst({
    where: {
      organization_id: campaign.organization_id,
      user_id: user.id,
      role: { in: [MemberRole.ADMIN, MemberRole.MODERATOR] },
    },
  });

  if (!isAuthorized)
    throw new ApiError(status.FORBIDDEN, 'Unauthorized access');

  return await prisma.campaign.delete({ where: { id } });
};

const getSingleCampaign = async (id: string) => {
  const result = await prisma.campaign.findUnique({
    where: { id },
    include: {
      organization: {
        select: {
          id: true,
          name: true,
          logo: true,
          division: true,
          district: true,
          contact_number: true, // ক্যাম্পেইন নিয়ে যোগাযোগ করার জন্য এটি যোগ করা হয়েছে
        },
      },
    },
  });

  if (!result) {
    throw new ApiError(status.NOT_FOUND, 'Campaign not found');
  }

  return result;
};

export const CampaignService = {
  createCampaign,
  getAllCampaigns,
  deleteCampaign,
  getCampaignsByOrganization,
  getSingleCampaign,
};
