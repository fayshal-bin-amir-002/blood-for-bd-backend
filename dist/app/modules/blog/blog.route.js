"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = require("../../middlewares/validateRequest");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const blog_controller_1 = require("./blog.controller");
const blog_validation_1 = require("./blog.validation");
const client_1 = require("@prisma/client");
const router = express_1.default.Router();
router.post("/", (0, validateRequest_1.validateRequest)(blog_validation_1.BlogSchema), (0, auth_1.default)(client_1.UserRole.ADMIN), blog_controller_1.BlogController.createBlog);
router.get("/", blog_controller_1.BlogController.getAllBlogs);
router.get("/:id", blog_controller_1.BlogController.getABlog);
router.patch("/:id", (0, validateRequest_1.validateRequest)(blog_validation_1.BlogSchema), (0, auth_1.default)(client_1.UserRole.ADMIN), blog_controller_1.BlogController.updateBlog);
router.delete("/:id", (0, auth_1.default)(client_1.UserRole.ADMIN), blog_controller_1.BlogController.deleteBlog);
exports.BlogRoutes = router;
