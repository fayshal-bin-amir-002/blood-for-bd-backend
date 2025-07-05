import express from "express";
import { UserController } from "./user.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { registerUserZodSchema } from "./user.validation";

const router = express.Router();

router.post(
  "/register",
  validateRequest(registerUserZodSchema),
  UserController.registerUser
);

export const UserRoutes = router;
