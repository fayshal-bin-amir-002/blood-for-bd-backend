import { prisma } from "../../../shared/prisma";
import { monthNames } from "./meta.constant";

const getImpactData = async () => {
  const totalLivesSaved = await prisma.blood_Donation.count();
  const totalDonors = await prisma.donor.count();
  const registeredUsers = await prisma.user.count();
  const activeDonors = await prisma.donor.count({
    where: {
      isActive: true,
    },
  });

  return {
    totalLivesSaved,
    totalDonors,
    activeDonors,
    registeredUsers,
  };
};

const getStatsByYear = async (year: number) => {
  const data = [];

  const now = new Date();
  const currentYear = now.getUTCFullYear();
  const currentMonth = now.getUTCMonth();

  const maxMonth = year === currentYear ? currentMonth + 1 : 12;

  for (let month = 0; month < maxMonth; month++) {
    const startDate = new Date(Date.UTC(year, month, 1));
    const endDate = new Date(Date.UTC(year, month + 1, 0, 23, 59, 59));

    const [users, donors, donations, galleries, testimonials] =
      await Promise.all([
        prisma.user.count({
          where: { createdAt: { gte: startDate, lte: endDate } },
        }),
        prisma.donor.count({
          where: { createdAt: { gte: startDate, lte: endDate } },
        }),
        prisma.blood_Donation.count({
          where: { createdAt: { gte: startDate, lte: endDate } },
        }),
        prisma.gallery.count({
          where: { createdAt: { gte: startDate, lte: endDate } },
        }),
        prisma.testimonial.count({
          where: { createdAt: { gte: startDate, lte: endDate } },
        }),
      ]);

    data.push({
      month: monthNames[month],
      users,
      donors,
      donations,
      galleries,
      testimonials,
    });
  }

  return data;
};

const getAdminDashboardData = async (year: string) => {
  const impactData = await getImpactData();
  const statsByYear = await getStatsByYear(Number(year));

  return {
    impactData,
    statsByYear,
  };
};

export const MetaService = {
  getImpactData,
  getAdminDashboardData,
};
