import { prisma } from "../../../shared/prisma";
import ApiError from "../../errors/ApiError";
import { RegisterUserPayload } from "./user.interface";
import status from "http-status";
import bcrypt from "bcrypt";
import config from "../../../config";
import { jwtHelpers } from "../../../helpers/jwtHelpers";

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
      role: result.role,
      isDonor: result.isDonor,
    },
    config.jwt.jwt_access_token_secret as string,
    config.jwt.jwt_access_token_expires_in as string
  );

  const refreshToken = jwtHelpers.generateToken(
    {
      phone: result.phone,
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

export const UserService = {
  registerUser,
};
