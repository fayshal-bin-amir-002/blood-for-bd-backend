import status from "http-status";
import { catchAsync } from "../../../shared/catchAsync";
import { sendResponse } from "../../../shared/sendResponse";
import { UserService } from "./user.service";
import { IJwtPayload } from "../../../helpers/jwtHelpers";
import config from "../../../config";
import pick from "../../../shared/pick";
import { donorFilterableFields, userFilterableFields } from "./user.constant";

const registerUser = catchAsync(async (req, res) => {
  const { accessToken, refreshToken } = await UserService.registerUser(
    req.body
  );

  res.cookie("refreshToken", refreshToken, {
    secure: config.env === "production",
    httpOnly: true,
    sameSite: config.env === "production" ? "none" : "strict",
    maxAge: 1000 * 60 * 60 * 24 * 30,
  });

  sendResponse(res, {
    success: true,
    statusCode: status.CREATED,
    message: "User registered successfully.",
    data: {
      accessToken,
    },
  });
});

const loginUser = catchAsync(async (req, res) => {
  const { accessToken, refreshToken } = await UserService.loginUser(req.body);

  res.cookie("refreshToken", refreshToken, {
    secure: config.env === "production",
    httpOnly: true,
    sameSite: config.env === "production" ? "none" : "strict",
    maxAge: 1000 * 60 * 60 * 24 * 30,
  });

  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "User login successfully.",
    data: {
      accessToken,
    },
  });
});

const refreshToken = catchAsync(async (req, res) => {
  const { refreshToken } = req.cookies;
  const result = await UserService.refreshToken(refreshToken);
  sendResponse(res, {
    success: true,
    statusCode: status.CREATED,
    message: "Access Token generated successfully.",
    data: {
      accessToken: result,
    },
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

const findDonor = catchAsync(async (req, res) => {
  const filters = pick(req.query, donorFilterableFields);
  const options = pick(req.query, ["limit", "page"]);
  const result = await UserService.findDonor(filters, options);
  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "Donors data retrived successfully",
    data: result?.data,
    meta: result?.meta,
  });
});

const getAllUser = catchAsync(async (req, res) => {
  const filters = pick(req.query, userFilterableFields);
  const options = pick(req.query, ["limit", "page"]);
  const result = await UserService.getAllUser(filters, options);
  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "Users data retrived successfully",
    data: result?.data,
    meta: result?.meta,
  });
});

const roleUpdate = catchAsync(async (req, res) => {
  const result = await UserService.roleUpdate(req.params.id, req.body);
  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "User role updated successfully",
    data: result,
  });
});

const statusUpdate = catchAsync(async (req, res) => {
  const result = await UserService.statusUpdate(req.params.id, req.body);
  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "User status updated successfully",
    data: result,
  });
});

const getDonorProfile = catchAsync(async (req, res) => {
  const result = await UserService.getDonorProfile(req.user as IJwtPayload);
  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "Donor profile retrived successfully",
    data: result,
  });
});

const updateDonorProfile = catchAsync(async (req, res) => {
  const result = await UserService.updateDonorProfile(req.params.id, req.body);
  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "Donor profile updated successfully",
    data: result,
  });
});

export const UserController = {
  registerUser,
  loginUser,
  refreshToken,
  createDonor,
  findDonor,
  getAllUser,
  roleUpdate,
  statusUpdate,
  getDonorProfile,
  updateDonorProfile,
};
