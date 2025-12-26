import express from 'express';
import { UserRole } from '@prisma/client';
import auth from '../../middlewares/auth';
import { validateRequest } from '../../middlewares/validateRequest';
import { CampaignController } from './campaign.controller';
import { CampaignValidation } from './campaign.validation';

const router = express.Router();

router.post(
  '/',
  auth(UserRole.USER, UserRole.ADMIN),
  validateRequest(CampaignValidation.createCampaignZodSchema),
  CampaignController.createCampaign
);

router.get('/', CampaignController.getAllCampaigns);

router.delete(
  '/:id',
  auth(UserRole.USER, UserRole.ADMIN),
  CampaignController.deleteCampaign
);

export const CampaignRoutes = router;
