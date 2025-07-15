import status from "http-status";
import { IJwtPayload } from "../../../helpers/jwtHelpers";
import { prisma } from "../../../shared/prisma";
import ApiError from "../../errors/ApiError";
import { IGallery } from "./gallery.interface";

const addToGallery = async (user: IJwtPayload, payload: IGallery) => {
  const isUserExists = await prisma.user.findUnique({
    where: {
      phone: user.phone,
    },
  });

  if (!isUserExists) {
    throw new ApiError(status.FORBIDDEN, "User not exists!");
  }

  if (isUserExists.isBlocked) {
    throw new ApiError(status.FORBIDDEN, "User is blocked!");
  }

  const galleryData = {
    user_id: isUserExists.id,
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

export const GalleryService = {
  addToGallery,
  pulishStatusUpdate,
  deleteGallery,
  getAllGallery,
};
