"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_route_1 = require("../modules/user/user.route");
const donor_route_1 = require("../modules/donor/donor.route");
const blood_donation_route_1 = require("../modules/blood_donation/blood_donation.route");
const blog_route_1 = require("../modules/blog/blog.route");
const gallery_route_1 = require("../modules/gallery/gallery.route");
const router = express_1.default.Router();
const moduleRoutes = [
    {
        path: "/user",
        route: user_route_1.UserRoutes,
    },
    {
        path: "/donor",
        route: donor_route_1.DonorRoutes,
    },
    {
        path: "/blood-donation",
        route: blood_donation_route_1.BloodDonationRoutes,
    },
    {
        path: "/blog",
        route: blog_route_1.BlogRoutes,
    },
    {
        path: "/gallery",
        route: gallery_route_1.GalleryRoutes,
    },
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
exports.default = router;
