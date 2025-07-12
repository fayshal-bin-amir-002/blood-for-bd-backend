import express from "express";
import { UserRoutes } from "../modules/user/user.route";
import { DonorRoutes } from "../modules/donor/donor.route";

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
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
