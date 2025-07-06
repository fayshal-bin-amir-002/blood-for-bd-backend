import status from "http-status";
import { catchAsync } from "../../../shared/catchAsync";
import { sendResponse } from "../../../shared/sendResponse";
import { UserService } from "./user.service";
import { JwtPayload } from "jsonwebtoken";
import { IJwtPayload } from "../../../helpers/jwtHelpers";

const registerUser = catchAsync(async (req, res) => {
  const result = await UserService.registerUser(req.body);
  sendResponse(res, {
    success: true,
    statusCode: status.CREATED,
    message: "User registered successfully.",
    data: result,
  });
});

const loginUser = catchAsync(async (req, res) => {
  const result = await UserService.loginUser(req.body);
  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "User login successfully.",
    data: result,
  });
});

const createDonor = catchAsync(async (req, res) => {
  const result = await UserService.createDonor(
    req.user as IJwtPayload,
    req.body
  );
  sendResponse(res, {
    success: true,
    statusCode: status.CREATED,
    message: "Donor created successfully",
    data: result,
  });
});

export const UserController = {
  registerUser,
  loginUser,
  createDonor,
};
