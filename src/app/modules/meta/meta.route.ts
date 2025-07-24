import express from "express";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { MetaController } from "./meta.controller";

const router = express.Router();

router.get("/impact-data", MetaController.getImpactData);

router.get(
  "/dashboard-data/:year",
  auth(UserRole.ADMIN),
  MetaController.getAdminDashboardData
);

export const MetaRoutes = router;
