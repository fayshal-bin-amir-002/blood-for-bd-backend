import status from "http-status";
import { prisma } from "../../../shared/prisma";
import ApiError from "../../errors/ApiError";
import { ITestimonial } from "./testimonial.interface";
import { calculatePagination } from "../../../helpers/paginationHelper";
import { IPaginationOptions } from "../../interfaces/pagination";

const addToTestimonial = async (payload: ITestimonial) => {
  const testimonialData = {
    ...payload,
    isPublished: false,
  };

  const result = await prisma.testimonial.create({
    data: testimonialData,
  });

  return result;
};

const pulishStatusUpdate = async (
  id: string,
  payload: {
    status: "true" | "false";
  }
) => {
  const puslished = payload?.status === "true";
  const isExists = await prisma.testimonial.findUnique({
    where: {
      id,
    },
  });
  if (!isExists) {
    throw new ApiError(status.NOT_FOUND, "Testimonial not found");
  }

  const result = await prisma.testimonial.update({
    where: {
      id,
    },
    data: {
      isPublished: puslished,
    },
  });

  return result;
};

const deleteTestimonial = async (id: string) => {
  const isExists = await prisma.testimonial.findUnique({
    where: {
      id,
    },
  });
  if (!isExists) {
    throw new ApiError(status.NOT_FOUND, "Testimonial not found");
  }
  await prisma.testimonial.delete({
    where: {
      id,
    },
  });
};

const getAllTestimonial = async () => {
  const result = await prisma.testimonial.findMany({
    where: {
      isPublished: true,
    },
    take: 10,
    orderBy: {
      createdAt: "desc",
    },
  });
  return result;
};

const getAllTestimonialByAdmin = async (options: IPaginationOptions) => {
  options = {
    ...options,
  };
  const { limit, page, skip } = calculatePagination(options);
  const result = await prisma.testimonial.findMany({
    skip: skip,
    take: limit,
    orderBy: {
      createdAt: "desc",
    },
  });

  const total = await prisma.testimonial.count();

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

export const TestimonialService = {
  addToTestimonial,
  pulishStatusUpdate,
  deleteTestimonial,
  getAllTestimonial,
  getAllTestimonialByAdmin,
};
