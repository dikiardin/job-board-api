"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const prisma_1 = require("../generated/prisma");
const hashPassword_1 = require("../utils/hashPassword");
const clearDatabase_1 = require("./seed-data/clearDatabase");
const users_1 = require("./seed-data/users");
const subscriptions_1 = require("./seed-data/subscriptions");
const companies_1 = require("./seed-data/companies");
const applications_1 = require("./seed-data/applications");
const assessments_1 = require("./seed-data/assessments");
const badgesAndCvs_1 = require("./seed-data/badgesAndCvs");
const employmentAndReviews_1 = require("./seed-data/employmentAndReviews");
const socialAndAnalytics_1 = require("./seed-data/socialAndAnalytics");
const locationCache_1 = require("./seed-data/locationCache");
const prisma = new prisma_1.PrismaClient({
    datasources: {
        db: {
            url: process.env.DIRECT_URL || process.env.DATABASE_URL,
        },
    },
});
async function seed() {
    console.log("Seeding database...");
    await (0, clearDatabase_1.clearDatabase)(prisma);
    const now = new Date();
    const addDays = (days) => new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
    const [adminPassword, userPassword, developerPassword] = await Promise.all([
        (0, hashPassword_1.hashPassword)("Admin123"),
        (0, hashPassword_1.hashPassword)("User12345"),
        (0, hashPassword_1.hashPassword)("work00dev"),
    ]);
    const users = await (0, users_1.seedUsers)({
        prisma,
        now,
        passwords: {
            admin: adminPassword,
            user: userPassword,
            developer: developerPassword,
        },
    });
    const subscriptions = await (0, subscriptions_1.seedSubscriptions)({ prisma, now, addDays, users });
    const companies = await (0, companies_1.seedCompaniesAndJobs)({ prisma, now, addDays, users });
    await (0, applications_1.seedApplications)({ prisma, now, addDays, users, companies });
    const assessments = await (0, assessments_1.seedAssessments)({ prisma, now, addDays, users });
    await (0, badgesAndCvs_1.seedBadgesAndCvs)({ prisma, now, users, assessments });
    await (0, employmentAndReviews_1.seedEmploymentAndReviews)({ prisma, now, users, companies });
    await (0, socialAndAnalytics_1.seedSocialAndAnalytics)({ prisma, users, companies, subscriptions, assessments });
    await (0, locationCache_1.seedLocationCache)(prisma);
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
