import { z } from "zod";

export const GallerySchema = z.object({
  body: z.object({
    name: z.string().trim().min(1, "Name is required"),
    image: z.string().trim().min(1, "Image is required"),
    isPublished: z.boolean().optional().default(false),
  }),
});

export const statusZodSchema = z.object({
  body: z.object({
    status: z.union([z.literal("true"), z.literal("false")]),
  }),
});
