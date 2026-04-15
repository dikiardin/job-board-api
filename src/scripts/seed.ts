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

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DIRECT_URL || process.env.DATABASE_URL!,
    },
  },
});

async function seed() {
  console.log("Seeding database...");
  await clearDatabase(prisma);

  const now = new Date();
  const addDays = (days: number) => new Date(now.getTime() + days * 24 * 60 * 60 * 1000);

  // All users share the same password: "Password123"
  const sharedPassword = await hashPassword("Password123");

  const users = await seedUsers({
    prisma,
    now,
    passwords: {
      admin: sharedPassword,
      user: sharedPassword,
      developer: sharedPassword,
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
  console.log("");
  console.log("=== Login Credentials (all users) ===");
  console.log("Password: password123");
  console.log("");
  console.log("DEVELOPER:     developer@workoo.com");
  console.log("ADMIN (Tech):  andre.pratama@techcorp.id");
  console.log("ADMIN (Design):maya.siregar@creativestudio.id");
  console.log("ADMIN (Fin):   surya.wijaya@fintechlabs.id");
  console.log("SEEKER:        alice.hartono@gmail.com");
  console.log("SEEKER:        bob.pratama@gmail.com");
  console.log("SEEKER:        charlie.wijaya@gmail.com");
  console.log("SEEKER:        diana.sari@gmail.com");
  console.log("SEEKER:        eko.santoso@gmail.com");
  console.log("SEEKER:        gina.putri@gmail.com");
  console.log("SEEKER:        hadi.susanto@gmail.com");
  console.log("SEEKER:        indah.lestari@gmail.com");
}

seed()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
