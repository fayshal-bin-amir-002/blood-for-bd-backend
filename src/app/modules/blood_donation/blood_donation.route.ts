import express from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import { UserRole } from "../../../generated/prisma";
import auth from "../../middlewares/auth";
import { BloodDonationController } from "./blood_donation.controller";
import { bloodDonationSchema } from "./blood_donation.validation";

const router = express.Router();

router.post(
  "/",
  validateRequest(bloodDonationSchema),
  auth(UserRole.USER),
  BloodDonationController.createBloodDonation
);

router.get(
  "/",
  auth(UserRole.USER),
  BloodDonationController.getAllBloodDonation
);

router.patch(
  "/:id",
  validateRequest(bloodDonationSchema),
  auth(UserRole.USER),
  BloodDonationController.updateBloodDonation
);

router.delete(
  "/:id",
  auth(UserRole.USER),
  BloodDonationController.deleteBloodDonation
);

export const BloodDonationRoutes = router;
