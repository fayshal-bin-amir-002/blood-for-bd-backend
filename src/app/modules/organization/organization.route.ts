import express from 'express';
import { UserRole } from '@prisma/client';
import auth from '../../middlewares/auth';
import { validateRequest } from '../../middlewares/validateRequest';
import { OrganizationController } from './organization.controller';
import { OrganizationValidation } from './organization.validation';

const router = express.Router();

router.post(
  '/',
  validateRequest(OrganizationValidation.createOrganizationZodSchema),
  auth(UserRole.USER, UserRole.ADMIN),
  OrganizationController.createOrganization
);

router.get('/', OrganizationController.getAllOrganizations);

router.post(
  '/join/:id',
  auth(UserRole.USER, UserRole.ADMIN),
  OrganizationController.joinOrganization
);

router.patch(
  '/approve-member/:memberId',
  validateRequest(OrganizationValidation.memberStatusUpdateZodSchema),
  auth(UserRole.USER, UserRole.ADMIN),
  OrganizationController.approveMemberRequest
);

router.delete(
  '/leave/:id',
  auth(UserRole.USER, UserRole.ADMIN),
  OrganizationController.leaveOrganization
);

export const OrganizationRoutes = router;
