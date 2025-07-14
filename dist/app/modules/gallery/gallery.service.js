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
exports.GalleryService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const prisma_1 = require("../../../shared/prisma");
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const addToGallery = (user, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExists = yield prisma_1.prisma.user.findUnique({
        where: {
            phone: user.phone,
        },
    });
    if (!isUserExists) {
        throw new ApiError_1.default(http_status_1.default.FORBIDDEN, "User not exists!");
    }
    if (isUserExists.isBlocked) {
        throw new ApiError_1.default(http_status_1.default.FORBIDDEN, "User is blocked!");
    }
    const galleryData = Object.assign(Object.assign({ user_id: isUserExists.id }, payload), { isPublished: false });
    const result = yield prisma_1.prisma.gallery.create({
        data: galleryData,
    });
    return result;
});
const pulishStatusUpdate = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const puslished = (payload === null || payload === void 0 ? void 0 : payload.status) === "true";
    const isExists = yield prisma_1.prisma.gallery.findUnique({
        where: {
            id,
        },
    });
    if (!isExists) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Gallery photo not found");
    }
    const result = yield prisma_1.prisma.gallery.update({
        where: {
            id,
        },
        data: {
            isPublished: puslished,
        },
    });
    return result;
});
const deleteGallery = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const isExists = yield prisma_1.prisma.gallery.findUnique({
        where: {
            id,
        },
    });
    if (!isExists) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Gallery photo not found");
    }
    yield prisma_1.prisma.gallery.delete({
        where: {
            id,
        },
    });
});
const getAllGallery = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.prisma.gallery.findMany({
        where: {
            isPublished: true,
        },
        take: 20,
        orderBy: {
            createdAt: "desc",
        },
    });
    return result;
});
exports.GalleryService = {
    addToGallery,
    pulishStatusUpdate,
    deleteGallery,
    getAllGallery,
};
