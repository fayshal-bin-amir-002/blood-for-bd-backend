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
