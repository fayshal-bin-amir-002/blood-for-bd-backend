import status from "http-status";
import { catchAsync } from "../../../shared/catchAsync";
import { sendResponse } from "../../../shared/sendResponse";
import { UserService } from "./user.service";

const registerUser = catchAsync(async (req, res) => {
  const result = await UserService.registerUser(req.body);
  sendResponse(res, {
    success: true,
    statusCode: status.CREATED,
    message: "User registered successfully.",
    data: result,
  });
});

export const UserController = {
  registerUser,
};
