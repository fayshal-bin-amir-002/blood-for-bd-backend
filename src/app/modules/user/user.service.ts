import { prisma } from "../../../shared/prisma";
import ApiError from "../../errors/ApiError";
import { RegisterUserPayload } from "./user.interface";
import status from "http-status";
import bcrypt from "bcrypt";
import config from "../../config";

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

  return result;
};

export const UserService = {
  registerUser,
};
