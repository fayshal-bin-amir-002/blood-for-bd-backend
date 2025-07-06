import { prisma } from "../../../shared/prisma";
import ApiError from "../../errors/ApiError";
import { IDonor, RegisterUserPayload } from "./user.interface";
import status from "http-status";
import bcrypt from "bcrypt";
import config from "../../../config";
import { IJwtPayload, jwtHelpers } from "../../../helpers/jwtHelpers";

const registerUser = async (payload: RegisterUserPayload) => {
  const isUserExists = await prisma.user.findUnique({
    where: {
      phone: payload.phone,
    },
  });

  if (isUserExists) {
    throw new ApiError(
      status.BAD_REQUEST,
      "User already registered. Please login."
    );
  }

  const hashedPassword: string = await bcrypt.hash(payload?.password, 12);

  payload["password"] = hashedPassword;

  const result = await prisma.user.create({
    data: payload,
  });

  const accessToken = jwtHelpers.generateToken(
    {
      phone: result.phone,
      id: result.id,
      role: result.role,
      isDonor: result.isDonor,
    },
    config.jwt.jwt_access_token_secret as string,
    config.jwt.jwt_access_token_expires_in as string
  );

  const refreshToken = jwtHelpers.generateToken(
    {
      phone: result.phone,
      id: result.id,
      role: result.role,
      isDonor: result.isDonor,
    },
    config.jwt.jwt_refresh_token_secret as string,
    config.jwt.jwt_refresh_token_expires_in as string
  );

  return {
    accessToken,
    refreshToken,
  };
};

const loginUser = async (payload: RegisterUserPayload) => {
  const user = await prisma.user.findUnique({
    where: {
      phone: payload.phone,
    },
  });

  if (!user) {
    throw new ApiError(status.BAD_REQUEST, "User not exists!");
  }

  if (user.isBlocked) {
    throw new ApiError(status.BAD_REQUEST, "User is blocked!");
  }

  const isPasswordMatched = await bcrypt.compare(
    payload.password,
    user?.password
  );

  if (!isPasswordMatched) {
    throw new ApiError(status.BAD_REQUEST, "Wrong password!");
  }

  const accessToken = jwtHelpers.generateToken(
    {
      phone: user.phone,
      id: user.id,
      role: user.role,
      isDonor: user.isDonor,
    },
    config.jwt.jwt_access_token_secret as string,
    config.jwt.jwt_access_token_expires_in as string
  );

  const refreshToken = jwtHelpers.generateToken(
    {
      phone: user.phone,
      id: user.id,
      role: user.role,
      isDonor: user.isDonor,
    },
    config.jwt.jwt_refresh_token_secret as string,
    config.jwt.jwt_refresh_token_expires_in as string
  );

  return {
    accessToken,
    refreshToken,
  };
};

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
      id: isUserExists.id,
    },
  });

  if (isDonorExists) {
    throw new ApiError(status.BAD_REQUEST, "User is already a donor.");
  }

  const donorData = {
    ...payload,
    user_id: isUserExists.id,
  };

  const result = await prisma.$transaction(async (transactionClient) => {
    const result = await prisma.donor.create({
      data: donorData,
    });

    await transactionClient.user.update({
      where: {
        id: isUserExists.id,
      },
      data: {
        isDonor: true,
      },
    });

    return result;
  });

  return result;
};

export const UserService = {
  registerUser,
  loginUser,
  createDonor,
};
