import { z } from 'zod';

export const createCampaignZodSchema = z.object({
  body: z.object({
    organization_id: z.string({
      required_error: 'Organization ID is required',
    }),
    title: z.string().trim().min(1, 'Title is required'),
    description: z.string().trim().min(1, 'Description is required'),
    image: z.string().url().optional(),
    location: z.string().trim().min(1, 'Location is required'),
    campaign_date: z.preprocess((arg) => {
      if (typeof arg == 'string' || arg instanceof Date) return new Date(arg);
    }, z.date().optional()),
  }),
});

export const updateCampaignZodSchema = z.object({
  body: z.object({
    title: z.string().trim().min(1).optional(),
    description: z.string().trim().min(1).optional(),
    image: z.string().url().optional(),
    location: z.string().trim().min(1).optional(),
    campaign_date: z.preprocess((arg) => {
      if (typeof arg == 'string' || arg instanceof Date) return new Date(arg);
    }, z.date().optional()),
  }),
});

export const CampaignValidation = {
  createCampaignZodSchema,
  updateCampaignZodSchema,
};
