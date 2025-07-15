import status from "http-status";
import { catchAsync } from "../../../shared/catchAsync";
import { sendResponse } from "../../../shared/sendResponse";
import { TestimonialService } from "./testimonial.service";

const addToTestimonial = catchAsync(async (req, res) => {
  const result = await TestimonialService.addToTestimonial(req.body);
  sendResponse(res, {
    success: true,
    statusCode: status.CREATED,
    message:
      "In processing. Your Testimonial will post after admin review. Thank you.",
    data: result,
  });
});

const pulishStatusUpdate = catchAsync(async (req, res) => {
  const result = await TestimonialService.pulishStatusUpdate(
    req.params.id,
    req.body
  );
  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "Testimonial published stauts updated successfully",
    data: result,
  });
});

const deleteTestimonial = catchAsync(async (req, res) => {
  await TestimonialService.deleteTestimonial(req.params.id);
  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "Testimonial deleted successfully",
  });
});

const getAllTestimonial = catchAsync(async (req, res) => {
  const result = await TestimonialService.getAllTestimonial();
  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "Testimonial photo retrived successfully",
    data: result,
  });
});

export const TestimonialController = {
  addToTestimonial,
  pulishStatusUpdate,
  deleteTestimonial,
  getAllTestimonial,
};
