import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";
import { UserRole } from "../generated/prisma";

interface Payload {
  phone: string;
  role: UserRole;
  isDonor: boolean;
}

const generateToken = (
  payload: Payload,
  secret: string,
  expiresIn: string
): string => {
  const token = jwt.sign(
    {
      phone: payload.phone,
      role: payload.role,
      isDonor: payload.isDonor,
    },
    secret,
    {
      algorithm: "HS256",
      expiresIn,
    } as SignOptions
  );

  return token;
};

const verifyToken = (token: string, secret: string) =>
  jwt.verify(token, secret) as JwtPayload;

export const jwtHelpers = {
  generateToken,
  verifyToken,
};
