import status from "http-status";
import { IJwtPayload, jwtHelpers } from "../../../helpers/jwtHelpers";
import { prisma } from "../../../shared/prisma";
import ApiError from "../../errors/ApiError";
import { IDonor, IDonorLocation, IDonorProfile } from "../user/user.interface";
import { IPaginationOptions } from "../../interfaces/pagination";
import { calculatePagination } from "../../../helpers/paginationHelper";
import { Prisma, UserRole } from "@prisma/client";
import config from "../../../config";

const createDonor = async (user: IJwtPayload, payload: IDonor) => {
  const isUserExists = await prisma.user.findUnique({
    where: {
      phone: user.phone,
    },
  });

  if (!isUserExists) {
    throw new ApiError(status.FORBIDDEN, "User not exists!");
  }

  if (isUserExists.isBlocked) {
    throw new ApiError(status.FORBIDDEN, "User is blocked!");
  }

  const isDonorExists = await prisma.donor.findUnique({
    where: {
      user_id: isUserExists.id,
    },
  });

  if (isDonorExists) {
    throw new ApiError(status.BAD_REQUEST, "You are already a donor.");
  }

  const donorData = {
    ...payload,
    user_id: isUserExists.id,
  };

  const res = await prisma.$transaction(async (transactionClient: any) => {
    await prisma.donor.create({
      data: donorData,
    });

    const res = await transactionClient.user.update({
      where: {
        id: isUserExists.id,
      },
      data: {
        isDonor: true,
      },
    });
    return res;
  });

  const accessToken = jwtHelpers.generateToken(
    {
      phone: res.phone,
      id: res.id,
      role: res.role,
      isDonor: res.isDonor,
    },
    config.jwt.jwt_access_token_secret as string,
    config.jwt.jwt_access_token_expires_in as string
  );

  const refreshToken = jwtHelpers.generateToken(
    {
      phone: res.phone,
      id: res.id,
      role: res.role,
      isDonor: res.isDonor,
    },
    config.jwt.jwt_refresh_token_secret as string,
    config.jwt.jwt_refresh_token_expires_in as string
  );

  return {
    accessToken,
    refreshToken,
  };
};

const findDonor = async (params: any, options: IPaginationOptions) => {
  const filterData = { ...params };
  const { limit, page, skip } = calculatePagination(options);

  const andConditions: Prisma.DonorWhereInput[] = [{ isActive: true }];

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: (filterData as any)[key],
        },
      })),
    });
  }

  const whereConditions: Prisma.DonorWhereInput =
    andConditions?.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.donor.findMany({
    where: whereConditions,
    skip: skip,
    take: limit,
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      name: true,
      address: true,
      contact_number: true,
      division: true,
      district: true,
      sub_district: true,
      blood_group: true,
      last_donation_date: true,
    },
  });

  const total = await prisma.donor.count({
    where: whereConditions,
  });

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getDonorProfile = async (payload: IJwtPayload) => {
  const { id } = payload;
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
  });

  if (!user) {
    throw new ApiError(status.BAD_REQUEST, "User not exists!");
  }

  if (user.isBlocked) {
    throw new ApiError(status.BAD_REQUEST, "User is blocked!");
  }

  if (!user.isDonor) {
    throw new ApiError(status.BAD_REQUEST, "This user not a donor.");
  }

  const result = await prisma.donor.findUnique({
    where: {
      user_id: id,
    },
  });

  if (!result) {
    throw new ApiError(status.BAD_REQUEST, "Donor not exists!");
  }

  if (!result.isActive) {
    throw new ApiError(status.BAD_REQUEST, "Donor is blocked!");
  }

  return result;
};

const updateDonorProfile = async (
  user: IJwtPayload,
  payload: IDonorProfile
) => {
  const isUserExists = await prisma.user.findUnique({
    where: {
      id: user.id,
    },
  });

  if (!isUserExists) {
    throw new ApiError(status.BAD_REQUEST, "User not exists!");
  }

  if (isUserExists.isBlocked) {
    throw new ApiError(status.BAD_REQUEST, "User is blocked!");
  }

  const isDonorExists = await prisma.donor.findUnique({
    where: {
      user_id: isUserExists.id,
    },
  });

  if (!isDonorExists) {
    throw new ApiError(status.FORBIDDEN, "Donor not found!");
  }

  const result = await prisma.donor.update({
    where: {
      user_id: isUserExists.id,
    },
    data: payload,
    select: {
      id: true,
      user_id: true,
      name: true,
      address: true,
      contact_number: true,
      division: true,
      district: true,
      sub_district: true,
      blood_group: true,
      last_donation_date: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return result;
};

const updateDonorLocation = async (
  user: IJwtPayload,
  payload: IDonorLocation
) => {
  const isUserExists = await prisma.user.findUnique({
    where: {
      id: user.id,
    },
  });

  if (!isUserExists) {
    throw new ApiError(status.BAD_REQUEST, "User not exists!");
  }

  if (isUserExists.isBlocked) {
    throw new ApiError(status.BAD_REQUEST, "User is blocked!");
  }

  const isDonorExists = await prisma.donor.findUnique({
    where: {
      user_id: isUserExists.id,
    },
  });

  if (!isDonorExists) {
    throw new ApiError(status.FORBIDDEN, "Donor not found!");
  }

  const result = await prisma.donor.update({
    where: {
      user_id: isUserExists.id,
    },
    data: payload,
    select: {
      id: true,
      user_id: true,
      name: true,
      address: true,
      contact_number: true,
      division: true,
      district: true,
      sub_district: true,
      blood_group: true,
      last_donation_date: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return result;
};

const updateDonarActiveStatus = async (
  user: IJwtPayload,
  payload: { status: "true" | "false" }
) => {
  const { id } = user;
  const isUserExists = await prisma.user.findUnique({
    where: {
      id,
    },
  });

  if (!isUserExists) {
    throw new ApiError(status.FORBIDDEN, "User not exists!");
  }

  if (isUserExists.isBlocked) {
    throw new ApiError(status.FORBIDDEN, "User is blocked!");
  }

  const isDonorExists = await prisma.donor.findUnique({
    where: {
      user_id: id,
    },
  });

  if (!isDonorExists) {
    throw new ApiError(status.FORBIDDEN, "Donor not exists!");
  }

  const isDisabled = payload.status === "true";

  const result = await prisma.donor.update({
    where: {
      id: isDonorExists.id,
    },
    data: {
      isActive: isDisabled,
      disabledBy: !isDisabled ? UserRole.USER : null,
    },
    select: {
      id: true,
      user_id: true,
      name: true,
      address: true,
      contact_number: true,
      division: true,
      district: true,
      sub_district: true,
      blood_group: true,
      last_donation_date: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return result;
};

export const DonorService = {
  createDonor,
  findDonor,
  getDonorProfile,
  updateDonorProfile,
  updateDonarActiveStatus,
  updateDonorLocation,
};
