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
exports.UserController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = require("../../../shared/catchAsync");
const sendResponse_1 = require("../../../shared/sendResponse");
const user_service_1 = require("./user.service");
const config_1 = __importDefault(require("../../../config"));
const pick_1 = __importDefault(require("../../../shared/pick"));
const user_constant_1 = require("./user.constant");
const registerUser = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { accessToken, refreshToken } = yield user_service_1.UserService.registerUser(req.body);
    res.cookie("refreshToken", refreshToken, {
        secure: config_1.default.env === "production",
        httpOnly: true,
        sameSite: config_1.default.env === "production" ? "none" : "strict",
        maxAge: 1000 * 60 * 60 * 24 * 30,
    });
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_1.default.CREATED,
        message: "User registered successfully.",
        data: {
            accessToken,
        },
    });
}));
const loginUser = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { accessToken, refreshToken } = yield user_service_1.UserService.loginUser(req.body);
    res.cookie("refreshToken", refreshToken, {
        secure: config_1.default.env === "production",
        httpOnly: true,
        sameSite: config_1.default.env === "production" ? "none" : "strict",
        maxAge: 1000 * 60 * 60 * 24 * 30,
    });
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "User login successfully.",
        data: {
            accessToken,
        },
    });
}));
const refreshToken = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { refreshToken } = req.cookies;
    const result = yield user_service_1.UserService.refreshToken(refreshToken);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_1.default.CREATED,
        message: "Access Token generated successfully.",
        data: {
            accessToken: result,
        },
    });
}));
const getAllUser = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filters = (0, pick_1.default)(req.query, user_constant_1.userFilterableFields);
    const options = (0, pick_1.default)(req.query, ["limit", "page"]);
    const result = yield user_service_1.UserService.getAllUser(filters, options);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Users data retrived successfully",
        data: result === null || result === void 0 ? void 0 : result.data,
        meta: result === null || result === void 0 ? void 0 : result.meta,
    });
}));
const roleUpdate = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_service_1.UserService.roleUpdate(req.params.id, req.body);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "User role updated successfully",
        data: result,
    });
}));
const statusUpdate = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_service_1.UserService.statusUpdate(req.params.id, req.body);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "User status updated successfully",
        data: result,
    });
}));
exports.UserController = {
    registerUser,
    loginUser,
    refreshToken,
    getAllUser,
    roleUpdate,
    statusUpdate,
};
