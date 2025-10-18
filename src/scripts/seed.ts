import dotenv from "dotenv";
dotenv.config();
import {
  PrismaClient,
} from "../generated/prisma";
import { hashPassword } from "../utils/hashPassword";
import { clearDatabase } from "./seed-data/clearDatabase";
import { seedUsers } from "./seed-data/users";
import { seedSubscriptions } from "./seed-data/subscriptions";
import { seedCompaniesAndJobs } from "./seed-data/companies";
import { seedApplications } from "./seed-data/applications";
import { seedAssessments } from "./seed-data/assessments";
import { seedBadgesAndCvs } from "./seed-data/badgesAndCvs";
import { seedEmploymentAndReviews } from "./seed-data/employmentAndReviews";
import { seedSocialAndAnalytics } from "./seed-data/socialAndAnalytics";
import { seedLocationCache } from "./seed-data/locationCache";

const prisma = new PrismaClient();

async function seed() {
  console.log("Seeding database...");
  await clearDatabase(prisma);

  const now = new Date();
  const addDays = (days: number) => new Date(now.getTime() + days * 24 * 60 * 60 * 1000);

  const [adminPassword, userPassword, developerPassword] = await Promise.all([
    hashPassword("admin123"),
    hashPassword("user12345"),
    hashPassword("work00dev"),
  ]);

  const users = await seedUsers({
    prisma,
    now,
    passwords: {
      admin: adminPassword,
      user: userPassword,
      developer: developerPassword,
    },
  });

  const subscriptions = await seedSubscriptions({ prisma, now, addDays, users });
  const companies = await seedCompaniesAndJobs({ prisma, now, addDays, users });
  await seedApplications({ prisma, now, addDays, users, companies });
  const assessments = await seedAssessments({ prisma, now, addDays, users });

  await seedBadgesAndCvs({ prisma, now, users, assessments });
  await seedEmploymentAndReviews({ prisma, now, users, companies });
  await seedSocialAndAnalytics({ prisma, users, companies, subscriptions, assessments });
  await seedLocationCache(prisma);

  console.log("Seed complete");
}

seed()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
