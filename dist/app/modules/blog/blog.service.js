"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const prisma_1 = require("../../../shared/prisma");
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const createBlog = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.prisma.blog.create({
        data: payload,
    });
    return result;
});
const getAllBlogs = (options) => __awaiter(void 0, void 0, void 0, function* () {
    options = Object.assign(Object.assign({}, options), { limit: 8 });
    const { limit, page, skip } = (0, paginationHelper_1.calculatePagination)(options);
    const result = yield prisma_1.prisma.blog.findMany({
        skip: skip,
        take: limit,
        orderBy: {
            createdAt: "desc",
        },
    });
    const total = yield prisma_1.prisma.blog.count();
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
});
const getABlog = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.prisma.blog.findUnique({
        where: {
            id,
        },
    });
    if (!result) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Blog not found!");
    }
    return result;
});
const updateBlog = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const blog = yield prisma_1.prisma.blog.findUnique({
        where: {
            id,
        },
    });
    if (!blog) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Blog not found!");
    }
    const result = yield prisma_1.prisma.blog.update({
        where: {
            id,
        },
        data: payload,
    });
    return result;
});
const deleteBlog = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const blog = yield prisma_1.prisma.blog.findUnique({
        where: {
            id,
        },
    });
    if (!blog) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Blog not found!");
    }
    yield prisma_1.prisma.blog.delete({
        where: {
            id,
        },
    });
});
exports.BlogService = {
    createBlog,
    getAllBlogs,
    getABlog,
    updateBlog,
    deleteBlog,
};
