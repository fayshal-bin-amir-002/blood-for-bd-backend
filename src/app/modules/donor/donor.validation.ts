import { z } from 'zod';
import { bloodGroupEnum } from '../user/user.validation';

export const donorZodSchema = z.object({
  body: z.object({
    name: z.string().trim().min(1, 'Name is required'),
    address: z.string().trim().min(1, 'Address is required'),
    contact_number: z
      .string()
      .trim()
      .regex(/^\d{11}$/, {
        message: 'Contact number must be exactly 11 digits.',
      }),
    division: z.string().trim().min(1, 'Division is required'),
    district: z.string().trim().min(1, 'District is required'),
    sub_district: z.string().trim().min(1, 'Sub-district is required'),
    blood_group: bloodGroupEnum,
    last_donation_date: z.preprocess((arg) => {
      if (typeof arg == 'string' || arg instanceof Date) return new Date(arg);
    }, z.date().optional()),
  }),
});

export const profileZodSchema = z.object({
  body: z.object({
    name: z.string().trim().min(1, 'Name is required'),
    contact_number: z
      .string()
      .trim()
      .regex(/^\d{11}$/, {
        message: 'Contact number must be exactly 11 digits.',
      }),
    blood_group: bloodGroupEnum,
    last_donation_date: z.preprocess((arg) => {
      if (typeof arg == 'string' || arg instanceof Date) return new Date(arg);
    }, z.date().optional()),
    isActive: z.boolean({
      required_error: 'isActive status is required',
    }),
  }),
});

export const locationZodSchema = z.object({
  body: z.object({
    address: z.string().trim().min(1, 'Address is required'),
    division: z.string().trim().min(1, 'Division is required'),
    district: z.string().trim().min(1, 'District is required'),
    sub_district: z.string().trim().min(1, 'Sub-district is required'),
  }),
});
