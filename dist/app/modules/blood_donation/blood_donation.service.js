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
exports.BloodDonationService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const prisma_1 = require("../../../shared/prisma");
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const createBloodDonation = (user, payload) => __awaiter(void 0, void 0, void 0, function* () {
    if (!user.isDonor) {
        throw new ApiError_1.default(http_status_1.default.FORBIDDEN, "You are not a donor!");
    }
    const donationData = Object.assign(Object.assign({}, payload), { user_id: user.id });
    const result = yield prisma_1.prisma.blood_Donation.create({
        data: donationData,
    });
    return result;
});
const getAllBloodDonation = (user) => __awaiter(void 0, void 0, void 0, function* () {
    if (!user.isDonor) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "You are not a donor!");
    }
    const result = yield prisma_1.prisma.blood_Donation.findMany({
        where: {
            user_id: user.id,
        },
        orderBy: {
            createdAt: "desc",
        },
    });
    return result;
});
const updateBloodDonation = (user, id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    if (!user.isDonor) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "You are not a donor!");
    }
    const isExists = yield prisma_1.prisma.blood_Donation.findUnique({
        where: {
            id,
        },
    });
    if (!isExists) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Blood Donation data not found!");
    }
    const result = yield prisma_1.prisma.blood_Donation.update({
        where: {
            user_id: user.id,
            id,
        },
        data: payload,
    });
    return result;
});
const deleteBloodDonation = (user, id) => __awaiter(void 0, void 0, void 0, function* () {
    if (!user.isDonor) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "You are not a donor!");
    }
    const isExists = yield prisma_1.prisma.blood_Donation.findUnique({
        where: {
            id,
        },
    });
    if (!isExists) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Blood Donation data not found!");
    }
    yield prisma_1.prisma.blood_Donation.delete({
        where: {
            user_id: user.id,
            id,
        },
    });
});
exports.BloodDonationService = {
    createBloodDonation,
    getAllBloodDonation,
    updateBloodDonation,
    deleteBloodDonation,
};
