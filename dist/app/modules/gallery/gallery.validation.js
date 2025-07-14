"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.statusZodSchema = exports.GallerySchema = void 0;
const zod_1 = require("zod");
exports.GallerySchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().trim().min(1, "Name is required"),
        image: zod_1.z.string().trim().min(1, "Image is required"),
        isPublished: zod_1.z.boolean().optional().default(false),
    }),
});
exports.statusZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        status: zod_1.z.union([zod_1.z.literal("true"), zod_1.z.literal("false")]),
    }),
});
