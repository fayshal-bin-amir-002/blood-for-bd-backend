import { z } from "zod";

export const registerUserZodSchema = z.object({
  body: z.object({
    phone: z
      .string()
      .trim()
      .regex(/^\d{11}$/, {
        message: "Phone number must be exactly 11 digits.",
      }),
    password: z
      .string()
      .trim()
      .length(6, { message: "Password must be exactly 6 characters long." }),
  }),
});

export const bloodGroupEnum = z.enum([
  "A_POS",
  "A_NEG",
  "B_POS",
  "B_NEG",
  "AB_POS",
  "AB_NEG",
  "O_POS",
  "O_NEG",
]);

export const donorZodSchema = z.object({
  body: z.object({
    name: z.string().trim().min(1, "Name is required"),
    address: z.string().trim().min(1, "Address is required"),
    contact_number: z
      .string()
      .trim()
      .regex(/^\d{11}$/, {
        message: "Contact number must be exactly 11 digits.",
      }),
    division: z.string().trim().min(1, "Division is required"),
    district: z.string().trim().min(1, "District is required"),
    sub_district: z.string().trim().min(1, "Sub-district is required"),
    blood_group: bloodGroupEnum,
    last_donation_date: z.preprocess((arg) => {
      if (typeof arg == "string" || arg instanceof Date) return new Date(arg);
    }, z.date().optional()),
  }),
});
