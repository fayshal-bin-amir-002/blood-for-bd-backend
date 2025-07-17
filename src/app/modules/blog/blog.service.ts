import status from "http-status";
import { calculatePagination } from "../../../helpers/paginationHelper";
import { prisma } from "../../../shared/prisma";
import ApiError from "../../errors/ApiError";
import { IPaginationOptions } from "../../interfaces/pagination";
import { IBlog } from "./blog.interface";

const createBlog = async (payload: IBlog) => {
  const result = await prisma.blog.create({
    data: payload,
  });

  return result;
};

const getAllBlogs = async (options: IPaginationOptions) => {
  options = {
    ...options,
  };
  const { limit, page, skip } = calculatePagination(options);
  const result = await prisma.blog.findMany({
    skip: skip,
    take: limit,
    orderBy: {
      createdAt: "desc",
    },
  });

  const total = await prisma.blog.count();

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getABlog = async (id: string) => {
  const result = await prisma.blog.findUnique({
    where: {
      id,
    },
  });

  if (!result) {
    throw new ApiError(status.NOT_FOUND, "Blog not found!");
  }

  return result;
};

const updateBlog = async (id: string, payload: IBlog) => {
  const blog = await prisma.blog.findUnique({
    where: {
      id,
    },
  });

  if (!blog) {
    throw new ApiError(status.NOT_FOUND, "Blog not found!");
  }

  const result = await prisma.blog.update({
    where: {
      id,
    },
    data: payload,
  });

  return result;
};

const deleteBlog = async (id: string) => {
  const blog = await prisma.blog.findUnique({
    where: {
      id,
    },
  });

  if (!blog) {
    throw new ApiError(status.NOT_FOUND, "Blog not found!");
  }

  await prisma.blog.delete({
    where: {
      id,
    },
  });
};

export const BlogService = {
  createBlog,
  getAllBlogs,
  getABlog,
  updateBlog,
  deleteBlog,
};
