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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const prisma_1 = require("../../../shared/prisma");
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const http_status_1 = __importDefault(require("http-status"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const config_1 = __importDefault(require("../../../config"));
const jwtHelpers_1 = require("../../../helpers/jwtHelpers");
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const client_1 = require("@prisma/client");
const user_constant_1 = require("./user.constant");
const registerUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExists = yield prisma_1.prisma.user.findUnique({
        where: {
            phone: payload.phone,
        },
    });
    if (isUserExists) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "User already registered. Please login.");
    }
    const hashedPassword = yield bcrypt_1.default.hash(payload === null || payload === void 0 ? void 0 : payload.password, 12);
    payload["password"] = hashedPassword;
    const userData = Object.assign(Object.assign({}, payload), { role: client_1.UserRole.USER });
    const result = yield prisma_1.prisma.user.create({
        data: userData,
    });
    const accessToken = jwtHelpers_1.jwtHelpers.generateToken({
        phone: result.phone,
        id: result.id,
        role: result.role,
        isDonor: result.isDonor,
    }, config_1.default.jwt.jwt_access_token_secret, config_1.default.jwt.jwt_access_token_expires_in);
    const refreshToken = jwtHelpers_1.jwtHelpers.generateToken({
        phone: result.phone,
        id: result.id,
        role: result.role,
        isDonor: result.isDonor,
    }, config_1.default.jwt.jwt_refresh_token_secret, config_1.default.jwt.jwt_refresh_token_expires_in);
    return {
        accessToken,
        refreshToken,
    };
});
const loginUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma_1.prisma.user.findUnique({
        where: {
            phone: payload.phone,
        },
    });
    if (!user) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "User not exists!");
    }
    if (user.isBlocked) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "User is blocked!");
    }
    const isPasswordMatched = yield bcrypt_1.default.compare(payload.password, user === null || user === void 0 ? void 0 : user.password);
    if (!isPasswordMatched) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Wrong password!");
    }
    const accessToken = jwtHelpers_1.jwtHelpers.generateToken({
        phone: user.phone,
        id: user.id,
        role: user.role,
        isDonor: user.isDonor,
    }, config_1.default.jwt.jwt_access_token_secret, config_1.default.jwt.jwt_access_token_expires_in);
    const refreshToken = jwtHelpers_1.jwtHelpers.generateToken({
        phone: user.phone,
        id: user.id,
        role: user.role,
        isDonor: user.isDonor,
    }, config_1.default.jwt.jwt_refresh_token_secret, config_1.default.jwt.jwt_refresh_token_expires_in);
    return {
        accessToken,
        refreshToken,
    };
});
const refreshToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    let decodedData;
    try {
        decodedData = jwtHelpers_1.jwtHelpers.verifyToken(token, config_1.default.jwt.jwt_refresh_token_secret);
    }
    catch (err) {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, "You are not authorized");
    }
    const user = yield prisma_1.prisma.user.findUnique({
        where: {
            id: decodedData === null || decodedData === void 0 ? void 0 : decodedData.id,
        },
    });
    if (!user) {
        throw new ApiError_1.default(http_status_1.default.FORBIDDEN, "User not exists!");
    }
    if (user.isBlocked) {
        throw new ApiError_1.default(http_status_1.default.FORBIDDEN, "User is blocked!");
    }
    const accessToken = jwtHelpers_1.jwtHelpers.generateToken({
        phone: user.phone,
        id: user.id,
        role: user.role,
        isDonor: user.isDonor,
    }, config_1.default.jwt.jwt_access_token_secret, config_1.default.jwt.jwt_access_token_expires_in);
    return accessToken;
});
const getAllUser = (params, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { searchTerm } = params, rawFilterData = __rest(params, ["searchTerm"]);
    const { limit, page, skip } = (0, paginationHelper_1.calculatePagination)(options);
    const andConditions = [];
    const filterData = {};
    for (const [key, value] of Object.entries(rawFilterData)) {
        if (value === "true") {
            filterData[key] = true;
        }
        else if (value === "false") {
            filterData[key] = false;
        }
        else {
            filterData[key] = value;
        }
    }
    if (params === null || params === void 0 ? void 0 : params.searchTerm) {
        andConditions.push({
            OR: user_constant_1.userSearchAbleFields.map((field) => ({
                [field]: {
                    contains: params === null || params === void 0 ? void 0 : params.searchTerm,
                    mode: "insensitive",
                },
            })),
        });
    }
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
    const result = yield prisma_1.prisma.user.findMany({
        where: whereConditions,
        skip: skip,
        take: limit,
        orderBy: {
            createdAt: "desc",
        },
        select: {
            id: true,
            phone: true,
            role: true,
            isDonor: true,
            isBlocked: true,
            createdAt: true,
            updatedAt: true,
        },
    });
    const total = yield prisma_1.prisma.user.count({
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
const roleUpdate = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
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
    const result = yield prisma_1.prisma.user.update({
        where: {
            id,
        },
        data: {
            role: payload.role,
        },
        select: {
            id: true,
            phone: true,
            role: true,
            isBlocked: true,
        },
    });
    return result;
});
const statusUpdate = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExists = yield prisma_1.prisma.user.findUnique({
        where: {
            id,
        },
    });
    if (!isUserExists) {
        throw new ApiError_1.default(http_status_1.default.FORBIDDEN, "User not exists!");
    }
    const isBlocked = payload.status === "true";
    const result = yield prisma_1.prisma.$transaction((transactionClient) => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield prisma_1.prisma.user.update({
            where: {
                id,
            },
            data: {
                isBlocked: isBlocked,
            },
            select: {
                id: true,
                phone: true,
                isBlocked: true,
            },
        });
        if (isUserExists.isDonor) {
            const donor = yield prisma_1.prisma.donor.findUnique({
                where: {
                    user_id: isUserExists.id,
                },
            });
            if ((donor === null || donor === void 0 ? void 0 : donor.disabledBy) === null && !isBlocked) {
                yield transactionClient.donor.update({
                    where: {
                        user_id: isUserExists.id,
                    },
                    data: {
                        isActive: !isBlocked,
                    },
                });
            }
            if (isBlocked) {
                yield transactionClient.donor.update({
                    where: {
                        user_id: isUserExists.id,
                    },
                    data: {
                        isActive: !isBlocked,
                    },
                });
            }
        }
        return result;
    }));
    return result;
});
exports.UserService = {
    registerUser,
    loginUser,
    refreshToken,
    getAllUser,
    roleUpdate,
    statusUpdate,
};
