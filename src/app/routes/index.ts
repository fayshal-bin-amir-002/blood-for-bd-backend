import express from "express";
import { UserRoutes } from "../modules/user/user.route";
import { DonorRoutes } from "../modules/donor/donor.route";
import { BloodDonationRoutes } from "../modules/blood_donation/blood_donation.route";
import { BlogRoutes } from "../modules/blog/blog.route";

const router = express.Router();

const moduleRoutes = [
  {
    path: "/user",
    route: UserRoutes,
  },
  {
    path: "/donor",
    route: DonorRoutes,
  },
  {
    path: "/blood-donation",
    route: BloodDonationRoutes,
  },
  {
    path: "/blog",
    route: BlogRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
