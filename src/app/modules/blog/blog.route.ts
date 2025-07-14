import express from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import auth from "../../middlewares/auth";
import { BlogController } from "./blog.controller";
import { BlogSchema } from "./blog.validation";
import { UserRole } from "@prisma/client";

const router = express.Router();

router.post(
  "/",
  validateRequest(BlogSchema),
  auth(UserRole.ADMIN),
  BlogController.createBlog
);

router.get("/", BlogController.getAllBlogs);

router.get("/:id", BlogController.getABlog);

router.patch(
  "/:id",
  validateRequest(BlogSchema),
  auth(UserRole.ADMIN),
  BlogController.updateBlog
);

router.delete("/:id", auth(UserRole.ADMIN), BlogController.deleteBlog);

export const BlogRoutes = router;
