"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.statusZodSchema = exports.roleZodSchema = exports.bloodGroupEnum = exports.registerUserZodSchema = void 0;
const zod_1 = require("zod");
const client_1 = require("@prisma/client");
exports.registerUserZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        phone: zod_1.z
            .string()
            .trim()
            .regex(/^\d{11}$/, {
            message: "Phone number must be exactly 11 digits.",
        }),
        password: zod_1.z
            .string()
            .trim()
            .length(6, { message: "Password must be exactly 6 characters long." }),
    }),
});
exports.bloodGroupEnum = zod_1.z.enum([
    "A_POS",
    "A_NEG",
    "B_POS",
    "B_NEG",
    "AB_POS",
    "AB_NEG",
    "O_POS",
    "O_NEG",
]);
exports.roleZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        role: zod_1.z.nativeEnum(client_1.UserRole, {
            errorMap: () => ({
                message: "Role must be either 'USER' or 'ADMIN'",
            }),
        }),
    }),
});
exports.statusZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        status: zod_1.z.union([zod_1.z.literal("true"), zod_1.z.literal("false")]),
    }),
});
