import status from "http-status";
import { IJwtPayload } from "../../../helpers/jwtHelpers";
import { catchAsync } from "../../../shared/catchAsync";
import { sendResponse } from "../../../shared/sendResponse";
import { BloodDonationService } from "./blood_donation.service";

const createBloodDonation = catchAsync(async (req, res) => {
  const result = await BloodDonationService.createBloodDonation(
    req.user as IJwtPayload,
    req.body
  );
  sendResponse(res, {
    success: true,
    statusCode: status.CREATED,
    message: "Blood donation created successfully",
    data: result,
  });
});

const getAllBloodDonation = catchAsync(async (req, res) => {
  const result = await BloodDonationService.getAllBloodDonation(
    req.user as IJwtPayload
  );
  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "Blood donation data retrived successfully",
    data: result,
  });
});

const updateBloodDonation = catchAsync(async (req, res) => {
  const result = await BloodDonationService.updateBloodDonation(
    req.user as IJwtPayload,
    req.params.id,
    req.body
  );
  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "Blood donation data updated successfully",
    data: result,
  });
});

const deleteBloodDonation = catchAsync(async (req, res) => {
  await BloodDonationService.deleteBloodDonation(
    req.user as IJwtPayload,
    req.params.id
  );
  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "Blood donation deleted successfully",
  });
});

export const BloodDonationController = {
  createBloodDonation,
  getAllBloodDonation,
  updateBloodDonation,
  deleteBloodDonation,
};
