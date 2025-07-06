import express from "express";
import { UserController } from "./user.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { donorZodSchema, registerUserZodSchema } from "./user.validation";
import auth from "../../middlewares/auth";
import { UserRole } from "../../../generated/prisma";

const router = express.Router();

router.post(
  "/register",
  validateRequest(registerUserZodSchema),
  UserController.registerUser
);

router.post(
  "/login",
  validateRequest(registerUserZodSchema),
  UserController.loginUser
);

router.post("/refreshToken", UserController.refreshToken);

router.post(
  "/donor",
  validateRequest(donorZodSchema),
  auth(UserRole.USER),
  UserController.createDonor
);

router.get("/find-donor", UserController.findDonor);

export const UserRoutes = router;
