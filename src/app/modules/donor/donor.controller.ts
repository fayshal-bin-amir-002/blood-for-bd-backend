import status from "http-status";
import { IJwtPayload } from "../../../helpers/jwtHelpers";
import { catchAsync } from "../../../shared/catchAsync";
import { sendResponse } from "../../../shared/sendResponse";
import { DonorService } from "./donor.service";
import pick from "../../../shared/pick";
import { donorFilterableFields } from "./donor.constant";
import config from "../../../config";

const createDonor = catchAsync(async (req, res) => {
  const { accessToken, refreshToken } = await DonorService.createDonor(
    req.user as IJwtPayload,
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
    message: "Congrats! You are a donor from now.",
    data: {
      accessToken,
      refreshToken,
    },
  });
});

const findDonor = catchAsync(async (req, res) => {
  const filters = pick(req.query, donorFilterableFields);
  const options = pick(req.query, ["limit", "page"]);
  const result = await DonorService.findDonor(filters, options);
  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "Donors data retrived successfully",
    data: result?.data,
    meta: result?.meta,
  });
});

const getDonorProfile = catchAsync(async (req, res) => {
  const result = await DonorService.getDonorProfile(req.user as IJwtPayload);
  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "Donor profile retrived successfully",
    data: result,
  });
});

const updateDonorProfile = catchAsync(async (req, res) => {
  const result = await DonorService.updateDonorProfile(
    req.user as IJwtPayload,
    req.body
  );
  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "Donor profile updated successfully",
    data: result,
  });
});

const updateDonarActiveStatus = catchAsync(async (req, res) => {
  const result = await DonorService.updateDonarActiveStatus(
    req.user as IJwtPayload,
    req.body
  );
  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "Donor profile updated successfully",
    data: result,
  });
});

export const DonorController = {
  createDonor,
  findDonor,
  getDonorProfile,
  updateDonorProfile,
  updateDonarActiveStatus,
};
