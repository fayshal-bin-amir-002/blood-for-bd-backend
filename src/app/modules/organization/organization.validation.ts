import { z } from 'zod';

export const createOrganizationZodSchema = z.object({
  body: z.object({
    name: z.string().trim().min(1, 'Organization name is required'),
    description: z.string().trim().min(1, 'Description is required'),
    email: z.string().email('Invalid email address').optional(),
    contact_number: z
      .string()
      .trim()
      .regex(/^\d{11}$/, {
        message: 'Contact number must be exactly 11 digits.',
      }),
    address: z.string().trim().min(1, 'Address is required'),
    division: z.string().trim().min(1, 'Division is required'),
    district: z.string().trim().min(1, 'District is required'),
    logo: z.string().url('Invalid logo URL').optional(),
  }),
});

export const updateOrganizationZodSchema = z.object({
  body: z.object({
    name: z.string().trim().min(1).optional(),
    description: z.string().trim().min(1).optional(),
    email: z.string().email().optional(),
    contact_number: z
      .string()
      .trim()
      .regex(/^\d{11}$/)
      .optional(),
    address: z.string().trim().min(1).optional(),
    division: z.string().trim().min(1).optional(),
    district: z.string().trim().min(1).optional(),
    logo: z.string().url().optional(),
  }),
});

export const memberStatusUpdateZodSchema = z.object({
  body: z.object({
    status: z.enum(['PENDING', 'JOINED', 'REJECTED']),
  }),
});

export const updateMemberRoleZodSchema = z.object({
  body: z.object({
    role: z.enum(['ADMIN', 'MODERATOR', 'MEMBER'], {
      required_error: 'Role is required',
    }),
  }),
});

export const OrganizationValidation = {
  createOrganizationZodSchema,
  updateOrganizationZodSchema,
  memberStatusUpdateZodSchema,
  updateMemberRoleZodSchema,
};
