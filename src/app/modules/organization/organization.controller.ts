import status from 'http-status';
import { IJwtPayload } from '../../../helpers/jwtHelpers';
import { catchAsync } from '../../../shared/catchAsync';
import { sendResponse } from '../../../shared/sendResponse';
import pick from '../../../shared/pick';
import { OrganizationService } from './organization.service';

const createOrganization = catchAsync(async (req, res) => {
  const result = await OrganizationService.createOrganization(
    req.user as IJwtPayload,
    req.body
  );

  sendResponse(res, {
    success: true,
    statusCode: status.CREATED,
    message:
      'Organization registered successfully. Waiting for admin approval.',
    data: result,
  });
});

const getAllOrganizations = catchAsync(async (req, res) => {
  const filters = pick(req.query, ['name', 'division', 'district', 'status']);
  const options = pick(req.query, ['limit', 'page']);
  const result = await OrganizationService.getAllOrganizations(
    filters,
    options
  );

  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: 'Organizations retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

const joinOrganization = catchAsync(async (req, res) => {
  const result = await OrganizationService.joinOrganization(
    req.user as IJwtPayload,
    req.params.id
  );

  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: 'Join request sent successfully',
    data: result,
  });
});

const approveMemberRequest = catchAsync(async (req, res) => {
  const result = await OrganizationService.approveMemberRequest(
    req.user as IJwtPayload,
    req.params.memberId
  );

  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: 'Member request approved successfully',
    data: result,
  });
});

const leaveOrganization = catchAsync(async (req, res) => {
  const result = await OrganizationService.leaveOrganization(
    req.user as IJwtPayload,
    req.params.id
  );

  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: 'Left organization successfully',
    data: result,
  });
});

export const OrganizationController = {
  createOrganization,
  getAllOrganizations,
  joinOrganization,
  approveMemberRequest,
  leaveOrganization,
};
