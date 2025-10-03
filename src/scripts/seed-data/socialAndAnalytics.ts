import { Prisma, PrismaClient, SharePlatform } from "../../generated/prisma";
import { SeedUsersResult } from "./users";
import { SeedCompaniesResult } from "./companies";
import { SeedSubscriptionsResult } from "./subscriptions";
import { SeedAssessmentsResult } from "./assessments";

interface SeedSocialOptions {
  prisma: PrismaClient;
  users: SeedUsersResult;
  companies: SeedCompaniesResult;
  subscriptions: SeedSubscriptionsResult;
  assessments: SeedAssessmentsResult;
}

export async function seedSocialAndAnalytics({
  prisma,
  users,
  companies,
  subscriptions,
  assessments,
}: SeedSocialOptions) {
  const { seekers } = users;
  const { jobs } = companies;
  const {
    assessments: { data: dataAssessment },
  } = assessments;

  await prisma.jobShare.createMany({
    data: [
      {
        userId: seekers.alice.id,
        jobId: jobs.frontend.id,
        platform: SharePlatform.LINKEDIN,
        sharedUrl: "https://jobboard.local/jobs/frontend",
        customMessage: "Excited to interview for this role!",
      },
      {
        userId: seekers.bob.id,
        jobId: jobs.dataScientist.id,
        platform: SharePlatform.WHATSAPP,
        customMessage: "Sharing this great data role!",
      },
      {
        userId: seekers.gina.id,
        jobId: jobs.uxDesigner.id,
        platform: SharePlatform.FACEBOOK,
        sharedUrl: "https://jobboard.local/jobs/ux-designer",
      },
    ],
  });

  await prisma.savedJob.createMany({
    data: [
      { userId: seekers.alice.id, jobId: jobs.dataScientist.id },
      { userId: seekers.bob.id, jobId: jobs.frontend.id },
      { userId: seekers.gina.id, jobId: jobs.productManager.id },
      { userId: seekers.charlie.id, jobId: jobs.uxDesigner.id },
    ],
  });

  await prisma.analyticsEvent.createMany({
    data: [
      {
        type: "job_view",
        userId: seekers.alice.id,
        payload: { jobId: jobs.frontend.id, source: "landing_page" } as Prisma.JsonObject,
        city: "Bandung",
        province: "Jawa Barat",
        gender: "Female",
        ageRange: "25-34",
      },
      {
        type: "job_apply",
        userId: seekers.bob.id,
        payload: { jobId: jobs.dataScientist.id } as Prisma.JsonObject,
        city: "Surabaya",
        province: "Jawa Timur",
        gender: "Male",
        ageRange: "25-34",
      },
      {
        type: "assessment_start",
        userId: seekers.gina.id,
        payload: { assessmentId: dataAssessment.id } as Prisma.JsonObject,
        city: "Jakarta",
        province: "DKI Jakarta",
        gender: "Female",
        ageRange: "25-34",
      },
      {
        type: "subscription_payment",
        userId: seekers.gina.id,
        payload: {
          subscriptionId: subscriptions.ginaProfessional.id,
          amount: 100_000,
        } as Prisma.JsonObject,
        city: "Jakarta",
        province: "DKI Jakarta",
      },
    ],
  });
}

