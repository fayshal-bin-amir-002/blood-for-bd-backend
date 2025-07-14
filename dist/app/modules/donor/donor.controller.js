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
exports.DonorController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = require("../../../shared/catchAsync");
const sendResponse_1 = require("../../../shared/sendResponse");
const donor_service_1 = require("./donor.service");
const pick_1 = __importDefault(require("../../../shared/pick"));
const donor_constant_1 = require("./donor.constant");
const createDonor = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield donor_service_1.DonorService.createDonor(req.user, req.body);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_1.default.CREATED,
        message: "Donor created successfully",
        data: result,
    });
}));
const findDonor = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filters = (0, pick_1.default)(req.query, donor_constant_1.donorFilterableFields);
    const options = (0, pick_1.default)(req.query, ["limit", "page"]);
    const result = yield donor_service_1.DonorService.findDonor(filters, options);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Donors data retrived successfully",
        data: result === null || result === void 0 ? void 0 : result.data,
        meta: result === null || result === void 0 ? void 0 : result.meta,
    });
}));
const getDonorProfile = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield donor_service_1.DonorService.getDonorProfile(req.user);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Donor profile retrived successfully",
        data: result,
    });
}));
const updateDonorProfile = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield donor_service_1.DonorService.updateDonorProfile(req.user, req.body);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Donor profile updated successfully",
        data: result,
    });
}));
const updateDonarActiveStatus = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield donor_service_1.DonorService.updateDonarActiveStatus(req.user, req.body);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Donor profile updated successfully",
        data: result,
    });
}));
exports.DonorController = {
    createDonor,
    findDonor,
    getDonorProfile,
    updateDonorProfile,
    updateDonarActiveStatus,
};
