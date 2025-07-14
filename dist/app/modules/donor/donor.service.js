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
exports.DonorService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const prisma_1 = require("../../../shared/prisma");
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const client_1 = require("@prisma/client");
const createDonor = (user, payload) => __awaiter(void 0, void 0, void 0, function* () {
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
    const isDonorExists = yield prisma_1.prisma.donor.findUnique({
        where: {
            id: isUserExists.id,
        },
    });
    if (isDonorExists) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "User is already a donor.");
    }
    const donorData = Object.assign(Object.assign({}, payload), { user_id: isUserExists.id });
    const result = yield prisma_1.prisma.$transaction((transactionClient) => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield prisma_1.prisma.donor.create({
            data: donorData,
        });
        yield transactionClient.user.update({
            where: {
                id: isUserExists.id,
            },
            data: {
                isDonor: true,
            },
        });
        return result;
    }));
    return result;
});
const findDonor = (params, options) => __awaiter(void 0, void 0, void 0, function* () {
    const filterData = Object.assign({}, params);
    const { limit, page, skip } = (0, paginationHelper_1.calculatePagination)(options);
    const andConditions = [{ isActive: true }];
    if (Object.keys(filterData).length > 0) {
        andConditions.push({
            AND: Object.keys(filterData).map((key) => ({
                [key]: {
                    equals: filterData[key],
                },
            })),
        });
    }
    const whereConditions = (andConditions === null || andConditions === void 0 ? void 0 : andConditions.length) > 0 ? { AND: andConditions } : {};
    const result = yield prisma_1.prisma.donor.findMany({
        where: whereConditions,
        skip: skip,
        take: limit,
        orderBy: {
            createdAt: "desc",
        },
        select: {
            id: true,
            name: true,
            address: true,
            contact_number: true,
            division: true,
            district: true,
            sub_district: true,
            blood_group: true,
            last_donation_date: true,
        },
    });
    const total = yield prisma_1.prisma.donor.count({
        where: whereConditions,
    });
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
});
const getDonorProfile = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = payload;
    const user = yield prisma_1.prisma.user.findUnique({
        where: {
            id,
        },
    });
    if (!user) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "User not exists!");
    }
    if (user.isBlocked) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "User is blocked!");
    }
    if (!user.isDonor) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "This user not a donor.");
    }
    const result = yield prisma_1.prisma.donor.findUnique({
        where: {
            user_id: id,
        },
    });
    if (!result) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Donor not exists!");
    }
    if (!result.isActive) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Donor is blocked!");
    }
    return result;
});
const updateDonorProfile = (user, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExists = yield prisma_1.prisma.user.findUnique({
        where: {
            id: user.id,
        },
    });
    if (!isUserExists) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "User not exists!");
    }
    if (isUserExists.isBlocked) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "User is blocked!");
    }
    const isDonorExists = yield prisma_1.prisma.donor.findUnique({
        where: {
            user_id: isUserExists.id,
        },
    });
    if (!isDonorExists) {
        throw new ApiError_1.default(http_status_1.default.FORBIDDEN, "Donor not found!");
    }
    const result = yield prisma_1.prisma.donor.update({
        where: {
            user_id: isUserExists.id,
        },
        data: payload,
        select: {
            id: true,
            user_id: true,
            name: true,
            address: true,
            contact_number: true,
            division: true,
            district: true,
            sub_district: true,
            blood_group: true,
            last_donation_date: true,
            isActive: true,
            createdAt: true,
            updatedAt: true,
        },
    });
    return result;
});
const updateDonarActiveStatus = (user, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = user;
    const isUserExists = yield prisma_1.prisma.user.findUnique({
        where: {
            id,
        },
    });
    if (!isUserExists) {
        throw new ApiError_1.default(http_status_1.default.FORBIDDEN, "User not exists!");
    }
    if (isUserExists.isBlocked) {
        throw new ApiError_1.default(http_status_1.default.FORBIDDEN, "User is blocked!");
    }
    const isDonorExists = yield prisma_1.prisma.donor.findUnique({
        where: {
            user_id: id,
        },
    });
    if (!isDonorExists) {
        throw new ApiError_1.default(http_status_1.default.FORBIDDEN, "Donor not exists!");
    }
    const isDisabled = payload.status === "true";
    const result = yield prisma_1.prisma.donor.update({
        where: {
            id: isDonorExists.id,
        },
        data: {
            isActive: isDisabled,
            disabledBy: !isDisabled ? client_1.UserRole.USER : null,
        },
        select: {
            id: true,
            user_id: true,
            name: true,
            address: true,
            contact_number: true,
            division: true,
            district: true,
            sub_district: true,
            blood_group: true,
            last_donation_date: true,
            isActive: true,
            createdAt: true,
            updatedAt: true,
        },
    });
    return result;
});
exports.DonorService = {
    createDonor,
    findDonor,
    getDonorProfile,
    updateDonorProfile,
    updateDonarActiveStatus,
};
