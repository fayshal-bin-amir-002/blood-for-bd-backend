import { z } from "zod";

export const BlogSchema = z.object({
  body: z.object({
    title: z.string().trim().min(1, "Title is required"),
    image: z.string().trim().min(1, "Image is required"),
    details: z.string().trim().min(1, "Details are required"),
  }),
});
