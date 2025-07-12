import { z } from "zod";

export const bloodDonationSchema = z.object({
  body: z.object({
    title: z.string().trim().min(1, { message: "Title is required" }),
    donation_date: z.coerce.date({ message: "Invalid date format" }),
    note: z.string().optional(),
  }),
});
