import status from "http-status";
import { catchAsync } from "../../../shared/catchAsync";
import { sendResponse } from "../../../shared/sendResponse";
import { MetaService } from "./meta.service";

const getImpactData = catchAsync(async (req, res) => {
  const result = await MetaService.getImpactData();
  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "Impact data retrived successfully",
    data: result,
  });
});

const getAdminDashboardData = catchAsync(async (req, res) => {
  const result = await MetaService.getAdminDashboardData(req?.params?.year);
  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "Admin dashbaord data retrived successfully",
    data: result,
  });
});

export const MetaController = {
  getImpactData,
  getAdminDashboardData,
};
