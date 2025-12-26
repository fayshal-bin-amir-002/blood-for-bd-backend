import express from 'express';
import { UserRoutes } from '../modules/user/user.route';
import { DonorRoutes } from '../modules/donor/donor.route';
import { BloodDonationRoutes } from '../modules/blood_donation/blood_donation.route';
import { BlogRoutes } from '../modules/blog/blog.route';
import { GalleryRoutes } from '../modules/gallery/gallery.route';
import { TestimonialRoutes } from '../modules/testimonial/testimonial.route';
import { MetaRoutes } from '../modules/meta/meta.route';
import { OrganizationRoutes } from '../modules/organization/organization.route';
import { CampaignRoutes } from '../modules/campaign/campaign.routes';

const router = express.Router();

const moduleRoutes = [
  {
    path: '/user',
    route: UserRoutes,
  },
  {
    path: '/donor',
    route: DonorRoutes,
  },
  {
    path: '/blood-donation',
    route: BloodDonationRoutes,
  },
  {
    path: '/blog',
    route: BlogRoutes,
  },
  {
    path: '/gallery',
    route: GalleryRoutes,
  },
  {
    path: '/testimonial',
    route: TestimonialRoutes,
  },
  {
    path: '/meta',
    route: MetaRoutes,
  },
  {
    path: '/organization',
    route: OrganizationRoutes,
  },
  {
    path: '/campaign',
    route: CampaignRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
