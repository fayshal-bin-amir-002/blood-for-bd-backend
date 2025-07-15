import status from "http-status";
import { catchAsync } from "../../../shared/catchAsync";
import { sendResponse } from "../../../shared/sendResponse";
import { GalleryService } from "./gallery.service";

const addToGallery = catchAsync(async (req, res) => {
  const result = await GalleryService.addToGallery(req.body);
  sendResponse(res, {
    success: true,
    statusCode: status.CREATED,
    message:
      "In processing. Your photo will post after admin review. Thank you.",
    data: result,
  });
});

const pulishStatusUpdate = catchAsync(async (req, res) => {
  const result = await GalleryService.pulishStatusUpdate(
    req.params.id,
    req.body
  );
  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "Gallery photo published stauts updated successfully",
    data: result,
  });
});

const deleteGallery = catchAsync(async (req, res) => {
  await GalleryService.deleteGallery(req.params.id);
  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "Gallery photo deleted successfully",
  });
});

const getAllGallery = catchAsync(async (req, res) => {
  const result = await GalleryService.getAllGallery();
  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "Gallery photo retrived successfully",
    data: result,
  });
});

export const GalleryController = {
  addToGallery,
  pulishStatusUpdate,
  deleteGallery,
  getAllGallery,
};
