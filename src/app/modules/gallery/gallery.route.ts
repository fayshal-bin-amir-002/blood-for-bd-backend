import express from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { GalleryController } from "./gallery.controller";
import { GallerySchema, statusZodSchema } from "./gallery.validation";

const router = express.Router();

router.post(
  "/",
  validateRequest(GallerySchema),
  auth(UserRole.ADMIN, UserRole.USER),
  GalleryController.addToGallery
);

router.get("/", GalleryController.getAllGallery);

router.patch(
  "/:id",
  validateRequest(statusZodSchema),
  auth(UserRole.ADMIN),
  GalleryController.pulishStatusUpdate
);

router.delete(
  "/:id",
  auth(UserRole.ADMIN, UserRole.USER),
  GalleryController.deleteGallery
);

export const GalleryRoutes = router;
