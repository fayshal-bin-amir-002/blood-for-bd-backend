"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.donorZodSchema = void 0;
const zod_1 = require("zod");
const user_validation_1 = require("../user/user.validation");
exports.donorZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().trim().min(1, "Name is required"),
        address: zod_1.z.string().trim().min(1, "Address is required"),
        contact_number: zod_1.z
            .string()
            .trim()
            .regex(/^\d{11}$/, {
            message: "Contact number must be exactly 11 digits.",
        }),
        division: zod_1.z.string().trim().min(1, "Division is required"),
        district: zod_1.z.string().trim().min(1, "District is required"),
        sub_district: zod_1.z.string().trim().min(1, "Sub-district is required"),
        blood_group: user_validation_1.bloodGroupEnum,
        last_donation_date: zod_1.z.preprocess((arg) => {
            if (typeof arg == "string" || arg instanceof Date)
                return new Date(arg);
        }, zod_1.z.date().optional()),
    }),
});
