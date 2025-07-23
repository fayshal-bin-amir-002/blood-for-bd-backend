import status from "http-status";
import { prisma } from "../../../shared/prisma";
import ApiError from "../../errors/ApiError";
import { IGallery } from "./gallery.interface";
import { IPaginationOptions } from "../../interfaces/pagination";
import { calculatePagination } from "../../../helpers/paginationHelper";

const addToGallery = async (payload: IGallery) => {
  const galleryData = {
    ...payload,
    isPublished: false,
  };

  const result = await prisma.gallery.create({
    data: galleryData,
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
  const isExists = await prisma.gallery.findUnique({
    where: {
      id,
    },
  });
  if (!isExists) {
    throw new ApiError(status.NOT_FOUND, "Gallery photo not found");
  }

  const result = await prisma.gallery.update({
    where: {
      id,
    },
    data: {
      isPublished: puslished,
    },
  });

  return result;
};

const deleteGallery = async (id: string) => {
  const isExists = await prisma.gallery.findUnique({
    where: {
      id,
    },
  });
  if (!isExists) {
    throw new ApiError(status.NOT_FOUND, "Gallery photo not found");
  }
  await prisma.gallery.delete({
    where: {
      id,
    },
  });
};

const getAllGallery = async () => {
  const result = await prisma.gallery.findMany({
    where: {
      isPublished: true,
    },
    take: 16,
    orderBy: {
      createdAt: "desc",
    },
  });
  return result;
};

const getAllGalleryByAdmin = async (options: IPaginationOptions) => {
  options = {
    ...options,
  };
  const { limit, page, skip } = calculatePagination(options);
  const result = await prisma.gallery.findMany({
    skip: skip,
    take: limit,
    orderBy: {
      createdAt: "desc",
    },
  });

  const total = await prisma.gallery.count();

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

export const GalleryService = {
  addToGallery,
  pulishStatusUpdate,
  deleteGallery,
  getAllGallery,
  getAllGalleryByAdmin,
};
