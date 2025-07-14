"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogSchema = void 0;
const zod_1 = require("zod");
exports.BlogSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().trim().min(1, "Title is required"),
        image: zod_1.z.string().trim().min(1, "Image is required"),
        details: zod_1.z.string().trim().min(1, "Details are required"),
    }),
});
