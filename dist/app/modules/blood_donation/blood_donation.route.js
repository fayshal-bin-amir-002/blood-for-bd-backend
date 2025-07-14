"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BloodDonationRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = require("../../middlewares/validateRequest");
const client_1 = require("@prisma/client");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const blood_donation_controller_1 = require("./blood_donation.controller");
const blood_donation_validation_1 = require("./blood_donation.validation");
const router = express_1.default.Router();
router.post("/", (0, validateRequest_1.validateRequest)(blood_donation_validation_1.bloodDonationSchema), (0, auth_1.default)(client_1.UserRole.USER), blood_donation_controller_1.BloodDonationController.createBloodDonation);
router.get("/", (0, auth_1.default)(client_1.UserRole.USER), blood_donation_controller_1.BloodDonationController.getAllBloodDonation);
router.patch("/:id", (0, validateRequest_1.validateRequest)(blood_donation_validation_1.bloodDonationSchema), (0, auth_1.default)(client_1.UserRole.USER), blood_donation_controller_1.BloodDonationController.updateBloodDonation);
router.delete("/:id", (0, auth_1.default)(client_1.UserRole.USER), blood_donation_controller_1.BloodDonationController.deleteBloodDonation);
exports.BloodDonationRoutes = router;
