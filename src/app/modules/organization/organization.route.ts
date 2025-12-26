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

router.patch(
  '/admin/update-status/:id',
  auth(UserRole.ADMIN),
  OrganizationController.changeOrganizationStatus
);

router.get(
  '/admin/all-organizations',
  auth(UserRole.ADMIN),
  OrganizationController.getAllOrganizationsByAdmin
);

router.get(
  '/:id',
  auth(UserRole.USER, UserRole.ADMIN),
  OrganizationController.getSingleOrganization
);

router.get(
  '/:id/members',
  auth(UserRole.USER, UserRole.ADMIN),
  OrganizationController.getOrganizationMembers
);

router.patch(
  '/update-member-role/:memberId',
  auth(UserRole.USER, UserRole.ADMIN),
  validateRequest(OrganizationValidation.updateMemberRoleZodSchema),
  OrganizationController.updateMemberRole
);

export const OrganizationRoutes = router;
