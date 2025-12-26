import status from 'http-status';
import { IJwtPayload } from '../../../helpers/jwtHelpers';
import { catchAsync } from '../../../shared/catchAsync';
import { sendResponse } from '../../../shared/sendResponse';
import pick from '../../../shared/pick';
import { CampaignService } from './campaign.service';

const createCampaign = catchAsync(async (req, res) => {
  const result = await CampaignService.createCampaign(
    req.user as IJwtPayload,
    req.body
  );

  sendResponse(res, {
    success: true,
    statusCode: status.CREATED,
    message: 'Campaign created successfully',
    data: result,
  });
});

const getAllCampaigns = catchAsync(async (req, res) => {
  const filters = pick(req.query, ['organization_id', 'location']);
  const options = pick(req.query, ['limit', 'page']);
  const result = await CampaignService.getAllCampaigns(filters, options);

  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: 'Campaigns retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

const deleteCampaign = catchAsync(async (req, res) => {
  const result = await CampaignService.deleteCampaign(
    req.user as IJwtPayload,
    req.params.id
  );

  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: 'Campaign deleted successfully',
    data: result,
  });
});

export const CampaignController = {
  createCampaign,
  getAllCampaigns,
  deleteCampaign,
};
