import express from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import { UserRole } from "@prisma/client";
import auth from "../../middlewares/auth";
import { BloodDonationController } from "./blood_donation.controller";
import { bloodDonationSchema } from "./blood_donation.validation";

const router = express.Router();

router.post(
  "/",
  validateRequest(bloodDonationSchema),
  auth(UserRole.USER, UserRole.ADMIN),
  BloodDonationController.createBloodDonation
);

router.get(
  "/",
  auth(UserRole.USER, UserRole.ADMIN),
  BloodDonationController.getAllBloodDonation
);

router.patch(
  "/:id",
  validateRequest(bloodDonationSchema),
  auth(UserRole.USER, UserRole.ADMIN),
  BloodDonationController.updateBloodDonation
);

router.delete(
  "/:id",
  auth(UserRole.USER, UserRole.ADMIN),
  BloodDonationController.deleteBloodDonation
);

export const BloodDonationRoutes = router;
