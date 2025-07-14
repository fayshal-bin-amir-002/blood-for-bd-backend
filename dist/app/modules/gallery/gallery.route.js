"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GalleryRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = require("../../middlewares/validateRequest");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const client_1 = require("@prisma/client");
const gallery_controller_1 = require("./gallery.controller");
const gallery_validation_1 = require("./gallery.validation");
const router = express_1.default.Router();
router.post("/", (0, validateRequest_1.validateRequest)(gallery_validation_1.GallerySchema), (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.USER), gallery_controller_1.GalleryController.addToGallery);
router.get("/", gallery_controller_1.GalleryController.getAllGallery);
router.patch("/:id", (0, validateRequest_1.validateRequest)(gallery_validation_1.statusZodSchema), (0, auth_1.default)(client_1.UserRole.ADMIN), gallery_controller_1.GalleryController.pulishStatusUpdate);
router.delete("/:id", (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.USER), gallery_controller_1.GalleryController.deleteGallery);
exports.GalleryRoutes = router;
