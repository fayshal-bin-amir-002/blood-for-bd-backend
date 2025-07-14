import express from "express";
import { validateRequest } from "../../middlewares/validateRequest";

import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { donorZodSchema } from "./donor.validation";
import { DonorController } from "./donor.controller";
import { statusZodSchema } from "../user/user.validation";

const router = express.Router();

router.post(
  "/",
  validateRequest(donorZodSchema),
  auth(UserRole.USER),
  DonorController.createDonor
);

router.get("/", DonorController.findDonor);

router.get(
  "/profile",
  auth(UserRole.ADMIN, UserRole.USER),
  DonorController.getDonorProfile
);

router.patch(
  "/profile-update",
  validateRequest(donorZodSchema),
  auth(UserRole.ADMIN, UserRole.USER),
  DonorController.updateDonorProfile
);

router.patch(
  "/profile-update/status",
  validateRequest(statusZodSchema),
  auth(UserRole.USER),
  DonorController.updateDonarActiveStatus
);

export const DonorRoutes = router;
