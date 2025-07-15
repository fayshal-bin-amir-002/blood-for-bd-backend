import express from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { TestimonialController } from "./testimonial.controller";
import { statusZodSchema, TestimonialSchema } from "./testimonial.validation";

const router = express.Router();

router.post(
  "/",
  validateRequest(TestimonialSchema),
  TestimonialController.addToTestimonial
);

router.get("/", TestimonialController.getAllTestimonial);

router.patch(
  "/:id",
  validateRequest(statusZodSchema),
  auth(UserRole.ADMIN),
  TestimonialController.pulishStatusUpdate
);

router.delete(
  "/:id",
  auth(UserRole.ADMIN),
  TestimonialController.deleteTestimonial
);

export const TestimonialRoutes = router;
