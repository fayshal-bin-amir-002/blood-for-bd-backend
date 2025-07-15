import { z } from "zod";

export const TestimonialSchema = z.object({
  body: z.object({
    name: z.string().trim().min(1, "Name is required"),
    address: z.string().trim().min(1, "Address is required"),
    message: z
      .string({ required_error: "Message is required" })
      .trim()
      .min(30, "কমপক্ষে ৩০ অক্ষরের একটি বার্তা দিন")
      .max(200, "সর্বোচ্চ ২০০ অক্ষরের মধ্যে আপনার বার্তা দিন"),
    isPublished: z.boolean().optional().default(false),
  }),
});

export const statusZodSchema = z.object({
  body: z.object({
    status: z.union([z.literal("true"), z.literal("false")]),
  }),
});
