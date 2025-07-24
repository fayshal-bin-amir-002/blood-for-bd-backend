import express from "express";
import { validateRequest } from "../../middlewares/validateRequest";

import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import {
  donorZodSchema,
  locationZodSchema,
  profileZodSchema,
} from "./donor.validation";
import { DonorController } from "./donor.controller";
import { statusZodSchema } from "../user/user.validation";

const router = express.Router();

router.post(
  "/",
  validateRequest(donorZodSchema),
  auth(UserRole.USER, UserRole.ADMIN),
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
  validateRequest(profileZodSchema),
  auth(UserRole.ADMIN, UserRole.USER),
  DonorController.updateDonorProfile
);

router.patch(
  "/location-update",
  validateRequest(locationZodSchema),
  auth(UserRole.ADMIN, UserRole.USER),
  DonorController.updateDonorLocation
);

router.patch(
  "/profile-update/status",
  validateRequest(statusZodSchema),
  auth(UserRole.USER, UserRole.ADMIN),
  DonorController.updateDonarActiveStatus
);

export const DonorRoutes = router;
