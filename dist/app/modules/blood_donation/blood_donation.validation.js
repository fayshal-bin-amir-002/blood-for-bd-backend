"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bloodDonationSchema = void 0;
const zod_1 = require("zod");
exports.bloodDonationSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().trim().min(1, { message: "Title is required" }),
        donation_date: zod_1.z.coerce.date({ message: "Invalid date format" }),
        note: zod_1.z.string().optional(),
    }),
});
