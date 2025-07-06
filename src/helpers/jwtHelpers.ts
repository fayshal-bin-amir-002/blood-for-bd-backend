import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";
import { UserRole } from "../generated/prisma";

export interface IJwtPayload {
  phone: string;
  id: string;
  role: UserRole;
  isDonor: boolean;
}

const generateToken = (
  payload: IJwtPayload,
  secret: string,
  expiresIn: string
): string => {
  const token = jwt.sign(
    {
      phone: payload.phone,
      id: payload.id,
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
