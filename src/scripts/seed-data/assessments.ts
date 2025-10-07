import {
  Badge,
  BadgeTemplate,
  Prisma,
  PrismaClient,
  SkillAssessment,
  SkillResult,
} from "../../generated/prisma";
import { SeedUsersResult } from "./users";
import { buildMCQ } from "./questionUtils";

interface SeedAssessmentsOptions {
  prisma: PrismaClient;
  now: Date;
  addDays: (days: number) => Date;
  users: SeedUsersResult;
}

export interface SeedAssessmentsResult {
  badgeTemplates: {
    frontend: BadgeTemplate;
    data: BadgeTemplate;
    test: BadgeTemplate;
  };
  assessments: {
    frontend: SkillAssessment;
    data: SkillAssessment;
    test: SkillAssessment;
  };
  badgePriorityReviewer: Badge;
  skillResults: {
    alice: SkillResult;
    gina: SkillResult;
    bob: SkillResult;
  };
}

export async function seedAssessments({
  prisma,
  now,
  addDays,
  users,
}: SeedAssessmentsOptions): Promise<SeedAssessmentsResult> {
  const { developer, seekers } = users;
  const badgeTemplateFrontend = await prisma.badgeTemplate.create({
    data: {
      name: "Frontend Specialist",
      icon: "https://placehold.co/64x64?text=FE",
      description: "Awarded for passing the Frontend mastery assessment with >= 75 score.",
      category: "Engineering",
      createdBy: developer.id,
    },
  });
  const badgeTemplateData = await prisma.badgeTemplate.create({
    data: {
      name: "Data Insights Expert",
      icon: "https://placehold.co/64x64?text=DS",
      description: "Awarded for exceptional performance in data science assessments.",
      category: "Data",
      createdBy: developer.id,
    },
  });
  const assessmentFrontend = await prisma.skillAssessment.create({
    data: {
      title: "Frontend Mastery",
      slug: "frontend-mastery",
      description: "25-question assessment covering accessibility, performance, testing.",
      category: "Frontend",
      createdBy: developer.id,
      badgeTemplateId: badgeTemplateFrontend.id,
      questions: {
        create: buildMCQ("Frontend Assessment", 25, "A", {
          A: "Always",
          B: "Sometimes",
          C: "Rarely",
          D: "Never",
        }),
      },
    },
  });
  const assessmentData = await prisma.skillAssessment.create({
    data: {
      title: "Data Science Challenge",
      slug: "data-science-challenge",
      description: "25-question assessment covering statistics, machine learning, and SQL.",
      category: "Data Science",
      createdBy: developer.id,
      badgeTemplateId: badgeTemplateData.id,
      questions: {
        create: buildMCQ("Data Assessment", 25, "B", {
          A: "Strongly disagree",
          B: "Agree",
          C: "Neutral",
          D: "Disagree",
        }),
      },
    },
  });

  // NEW: Testing Assessment with only 2 questions
  const badgeTemplateTest = await prisma.badgeTemplate.create({
    data: {
      name: "Quick Test Expert",
      icon: "https://placehold.co/64x64?text=QT",
      description: "Awarded for passing the quick test assessment with >= 75% score.",
      category: "Testing",
      createdBy: developer.id,
    },
  });

  const assessmentTest = await prisma.skillAssessment.create({
    data: {
      title: "Quick Test Assessment",
      slug: "quick-test-assessment",
      description: "2-question assessment for testing purposes. Perfect for quick validation of the assessment system.",
      category: "Testing",
      createdBy: developer.id,
      badgeTemplateId: badgeTemplateTest.id,
      questions: {
        create: [
          {
            question: "What is the primary purpose of unit testing in software development?",
            options: [
              "To test the entire application end-to-end",
              "To test individual components or functions in isolation",
              "To test database connections only",
              "To test user interface elements"
            ],
            answer: "To test individual components or functions in isolation",
          },
          {
            question: "Which HTTP status code indicates a successful response?",
            options: [
              "404 - Not Found",
              "500 - Internal Server Error", 
              "200 - OK",
              "401 - Unauthorized"
            ],
            answer: "200 - OK",
          },
        ],
      },
    },
  });
  const aliceAssessmentStart = addDays(-1);
  const aliceSkillResult = await prisma.skillResult.create({
    data: {
      userId: seekers.alice.id,
      assessmentId: assessmentFrontend.id,
      score: 92,
      isPassed: true,
      answers: {
        strengths: ["Accessibility", "Testing"],
        improvements: ["Micro frontends"],
      } as Prisma.JsonObject,
      startedAt: aliceAssessmentStart,
      finishedAt: new Date(aliceAssessmentStart.getTime() + 15 * 60 * 1000),
      durationSeconds: 900,
      certificateUrl: "https://res.cloudinary.com/demo/certificates/alice-fe.pdf",
      certificateCode: "CERT-FE-ALICE-001",
    },
  });
  await prisma.certificate.create({
    data: {
      code: "CERT-FE-ALICE-001",
      userId: seekers.alice.id,
      assessmentId: assessmentFrontend.id,
      skillResultId: aliceSkillResult.id,
      pdfUrl: "https://res.cloudinary.com/demo/certificates/alice-fe.pdf",
      qrUrl: "https://jobboard.local/qr/CERT-FE-ALICE-001.png",
      verificationUrl: "https://jobboard.local/verify/certificate/CERT-FE-ALICE-001",
      issuedAt: now,
      issuerId: developer.id,
    },
  });
  const ginaAssessmentStart = addDays(-2);
  const ginaSkillResult = await prisma.skillResult.create({
    data: {
      userId: seekers.gina.id,
      assessmentId: assessmentData.id,
      score: 88,
      isPassed: true,
      answers: {
        strengths: ["User research", "Rapid prototyping"],
      } as Prisma.JsonObject,
      startedAt: ginaAssessmentStart,
      finishedAt: new Date(ginaAssessmentStart.getTime() + 20 * 60 * 1000),
      durationSeconds: 1_200,
      certificateUrl: "https://res.cloudinary.com/demo/certificates/gina-data.pdf",
      certificateCode: "CERT-DATA-GINA-001",
    },
  });
  await prisma.certificate.create({
    data: {
      code: "CERT-DATA-GINA-001",
      userId: seekers.gina.id,
      assessmentId: assessmentData.id,
      skillResultId: ginaSkillResult.id,
      pdfUrl: "https://res.cloudinary.com/demo/certificates/gina-data.pdf",
      verificationUrl: "https://jobboard.local/verify/certificate/CERT-DATA-GINA-001",
      issuedAt: addDays(-2),
      issuerId: developer.id,
    },
  });
  const bobSkillResult = await prisma.skillResult.create({
    data: {
      userId: seekers.bob.id,
      assessmentId: assessmentData.id,
      score: 68,
      isPassed: false,
      answers: {
        summary: "Needs stronger foundation in statistics.",
      } as Prisma.JsonObject,
      startedAt: addDays(-3),
      finishedAt: addDays(-3),
      durationSeconds: 1_400,
    },
  });
  const badgePriorityReviewer = await prisma.badge.create({
    data: {
      name: "Priority Reviewer",
      icon: "https://placehold.co/64x64?text=PR",
      criteria: "Granted to Professional subscribers with active priority review.",
      category: "Community",
      createdBy: developer.id,
    },
  });
  return {
    badgeTemplates: { 
      frontend: badgeTemplateFrontend, 
      data: badgeTemplateData, 
      test: badgeTemplateTest 
    },
    assessments: { 
      frontend: assessmentFrontend, 
      data: assessmentData, 
      test: assessmentTest 
    },
    badgePriorityReviewer,
    skillResults: { alice: aliceSkillResult, gina: ginaSkillResult, bob: bobSkillResult },
  };
}

