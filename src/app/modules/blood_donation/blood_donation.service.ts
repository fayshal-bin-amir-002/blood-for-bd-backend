import status from "http-status";
import { Blood_Donation } from "../../../generated/prisma";
import { IJwtPayload } from "../../../helpers/jwtHelpers";
import { prisma } from "../../../shared/prisma";
import ApiError from "../../errors/ApiError";

const createBloodDonation = async (
  user: IJwtPayload,
  payload: Blood_Donation
) => {
  if (!user.isDonor) {
    throw new ApiError(status.FORBIDDEN, "You are not a donor!");
  }

  const donationData = {
    ...payload,
    user_id: user.id,
  };

  const result = await prisma.blood_Donation.create({
    data: donationData,
  });

  return result;
};

const getAllBloodDonation = async (user: IJwtPayload) => {
  if (!user.isDonor) {
    throw new ApiError(status.BAD_REQUEST, "You are not a donor!");
  }

  const result = await prisma.blood_Donation.findMany({
    where: {
      user_id: user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return result;
};

const updateBloodDonation = async (
  user: IJwtPayload,
  id: string,
  payload: Blood_Donation
) => {
  if (!user.isDonor) {
    throw new ApiError(status.BAD_REQUEST, "You are not a donor!");
  }

  const isExists = await prisma.blood_Donation.findUnique({
    where: {
      id,
    },
  });

  if (!isExists) {
    throw new ApiError(status.NOT_FOUND, "Blood Donation data not found!");
  }

  const result = await prisma.blood_Donation.update({
    where: {
      user_id: user.id,
      id,
    },
    data: payload,
  });

  return result;
};

const deleteBloodDonation = async (user: IJwtPayload, id: string) => {
  if (!user.isDonor) {
    throw new ApiError(status.BAD_REQUEST, "You are not a donor!");
  }

  const isExists = await prisma.blood_Donation.findUnique({
    where: {
      id,
    },
  });

  if (!isExists) {
    throw new ApiError(status.NOT_FOUND, "Blood Donation data not found!");
  }

  await prisma.blood_Donation.delete({
    where: {
      user_id: user.id,
      id,
    },
  });
};

export const BloodDonationService = {
  createBloodDonation,
  getAllBloodDonation,
  updateBloodDonation,
  deleteBloodDonation,
};
