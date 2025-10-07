import { Prisma, PrismaClient } from "../../generated/prisma";
import { SeedUsersResult } from "./users";
import { SeedAssessmentsResult } from "./assessments";

interface SeedBadgesOptions {
  prisma: PrismaClient;
  now: Date;
  users: SeedUsersResult;
  assessments: SeedAssessmentsResult;
}

export async function seedBadgesAndCvs({
  prisma,
  now,
  users,
  assessments,
}: SeedBadgesOptions) {
  const { seekers } = users;
  const {
    badgeTemplates: { frontend: frontendTemplate, data: dataTemplate },
    badgePriorityReviewer,
    assessments: { frontend: frontendAssessment, data: dataAssessment },
    skillResults,
  } = assessments;

  await prisma.userBadge.createMany({
    data: [
      {
        userId: seekers.alice.id,
        badgeTemplateId: frontendTemplate.id,
        assessmentId: frontendAssessment.id,
        earnedAt: now,
        badgeType: "skill",
      },
      {
        userId: seekers.gina.id,
        badgeTemplateId: dataTemplate.id,
        assessmentId: dataAssessment.id,
        earnedAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
        badgeType: "skill",
      },
      {
        userId: seekers.gina.id,
        badgeId: badgePriorityReviewer.id,
        earnedAt: now,
        badgeType: "subscription",
      },
    ],
  });

  await prisma.generatedCV.createMany({
    data: [
      {
        userId: seekers.alice.id,
        fileUrl: "https://res.cloudinary.com/demo/cv/alice.pdf",
        templateUsed: "ats",
        additionalInfo: {
          summary: "Frontend engineer with 6 years' experience.",
          links: ["https://github.com/alicehartono"],
        } as Prisma.JsonObject,
        isPriority: true,
      },
      {
        userId: seekers.gina.id,
        fileUrl: "https://res.cloudinary.com/demo/cv/gina.pdf",
        templateUsed: "modern",
        additionalInfo: {
          summary: "Product manager with fintech background.",
        } as Prisma.JsonObject,
        isPriority: true,
      },
      {
        userId: seekers.charlie.id,
        fileUrl: "https://res.cloudinary.com/demo/cv/charlie.pdf",
        templateUsed: "classic",
        additionalInfo: {
          summary: "Product ops specialist focusing on growth funnels.",
        } as Prisma.JsonObject,
        isPriority: false,
      },
    ],
  });

  await prisma.skillResult.updateMany({
    data: { updatedAt: now },
    where: {
      id: {
        in: [skillResults.alice.id, skillResults.gina.id, skillResults.bob.id],
      },
    },
  });
}

