import status from "http-status";
import { catchAsync } from "../../../shared/catchAsync";
import { sendResponse } from "../../../shared/sendResponse";
import { BlogService } from "./blog.service";
import pick from "../../../shared/pick";

const createBlog = catchAsync(async (req, res) => {
  const result = await BlogService.createBlog(req.body);
  sendResponse(res, {
    success: true,
    statusCode: status.CREATED,
    message: "Blog created successfully",
    data: result,
  });
});

const getAllBlogs = catchAsync(async (req, res) => {
  const options = pick(req.query, ["limit", "page"]);
  const result = await BlogService.getAllBlogs(options);
  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "Blogs retrived successfully",
    data: result?.data,
    meta: result?.meta,
  });
});

const getABlog = catchAsync(async (req, res) => {
  const result = await BlogService.getABlog(req.params.id);
  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "Blog retrived successfully",
    data: result,
  });
});

const updateBlog = catchAsync(async (req, res) => {
  const result = await BlogService.updateBlog(req.params.id, req.body);
  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "Blog updated successfully",
    data: result,
  });
});

const deleteBlog = catchAsync(async (req, res) => {
  await BlogService.deleteBlog(req.params.id);
  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "Blog deleted successfully",
  });
});

export const BlogController = {
  createBlog,
  getAllBlogs,
  getABlog,
  updateBlog,
  deleteBlog,
};
