import {
  Application,
  ApplicationStatus,
  InterviewStatus,
  Prisma,
  PrismaClient,
} from "../../generated/prisma";
import { SeedUsersResult } from "./users";
import { SeedCompaniesResult } from "./companies";
import { recordApplicantAnswers } from "./questionUtils";

interface SeedApplicationsOptions {
  prisma: PrismaClient;
  now: Date;
  addDays: (days: number) => Date;
  users: SeedUsersResult;
  companies: SeedCompaniesResult;
}

type AttachmentSeed = { url: string; fileName?: string; fileSize?: number };
type TimelineSeed = { status: ApplicationStatus; note: string; createdById?: number };
type InterviewSeed = {
  startsAt: Date;
  endsAt?: Date;
  status: InterviewStatus;
  reminderSentAt?: Date;
  createdById?: number;
  updatedById?: number;
  locationOrLink?: string;
  notes?: string;
};
type PreselectionSeed = { testId: number; score: number; passed: boolean; correctCount: number };
type ApplicationKey =
  | "aliceFrontend"
  | "bobData"
  | "ginaUx"
  | "charlieProduct"
  | "dianaMarketing"
  | "ekoCustomerSuccess";
type ApplicationSeed = {
  key: ApplicationKey;
  data: {
    userId: number;
    jobId: number;
    cvUrl: string;
    cvFileName?: string;
    cvFileSize?: number;
    expectedSalary?: number;
    expectedSalaryCurrency?: string;
    status: ApplicationStatus;
    reviewNote?: string;
    reviewUpdatedAt?: Date;
    referralSource?: string;
  };
  attachments?: AttachmentSeed[];
  timeline: TimelineSeed[];
  interview?: InterviewSeed;
  preselection?: PreselectionSeed;
};

interface SeedApplicationsResult {
  applications: Record<ApplicationKey, Application>;
}

export async function seedApplications({
  prisma,
  now,
  addDays,
  users,
  companies,
}: SeedApplicationsOptions): Promise<SeedApplicationsResult> {
  const { seekers, admins, developer } = users;
  const { jobs, tests } = companies;
  const { alice, bob, gina, charlie, diana, eko } = seekers;
  const hourMs = 60 * 60 * 1000;

  const applicationSeeds: ApplicationSeed[] = [
    {
      key: "aliceFrontend",
      data: { userId: alice.id, jobId: jobs.frontend.id, cvUrl: "https://res.cloudinary.com/demo/cv/alice-frontend.pdf", cvFileName: "alice-frontend.pdf", cvFileSize: 185_000, expectedSalary: 32_000_000, expectedSalaryCurrency: "IDR", status: ApplicationStatus.INTERVIEW, reviewNote: "Strong portfolio, proceed to interview", reviewUpdatedAt: now, referralSource: "LinkedIn" },
      attachments: [{ url: "https://res.cloudinary.com/demo/alice/portfolio.pdf", fileName: "portfolio.pdf", fileSize: 320_000 }],
      timeline: [
        { status: ApplicationStatus.SUBMITTED, note: "Application submitted via job board", createdById: alice.id },
        { status: ApplicationStatus.IN_REVIEW, note: "CV shortlisted by HR", createdById: admins.tech.id },
        { status: ApplicationStatus.INTERVIEW, note: "Interview invitation sent", createdById: admins.tech.id },
      ],
      interview: {
        startsAt: addDays(3),
        endsAt: new Date(addDays(3).getTime() + hourMs),
        status: InterviewStatus.SCHEDULED,
        reminderSentAt: addDays(2),
        createdById: admins.tech.id,
        updatedById: developer.id,
        locationOrLink: "Zoom https://zoom.us/j/123456789",
        notes: "Panel with engineering team.",
      },
      preselection: { testId: tests.frontend.id, score: 22, passed: true, correctCount: 22 },
    },
    {
      key: "bobData",
      data: { userId: bob.id, jobId: jobs.dataScientist.id, cvUrl: "https://res.cloudinary.com/demo/cv/bob-data.pdf", cvFileName: "bob-data.pdf", cvFileSize: 210_000, expectedSalary: 25_000_000, expectedSalaryCurrency: "IDR", status: ApplicationStatus.SUBMITTED, referralSource: "Career Portal" },
      timeline: [{ status: ApplicationStatus.SUBMITTED, note: "Awaiting review", createdById: bob.id }],
      preselection: { testId: tests.dataScientist.id, score: 14, passed: false, correctCount: 14 },
    },
    {
      key: "ginaUx",
      data: { userId: gina.id, jobId: jobs.uxDesigner.id, cvUrl: "https://res.cloudinary.com/demo/cv/gina-ux.pdf", cvFileName: "gina-ux.pdf", cvFileSize: 195_000, expectedSalary: 17_000_000, expectedSalaryCurrency: "IDR", status: ApplicationStatus.ACCEPTED, reviewNote: "Offer accepted, onboarding scheduled", reviewUpdatedAt: now },
      timeline: [
        { status: ApplicationStatus.SUBMITTED, note: "Portfolio received", createdById: gina.id },
        { status: ApplicationStatus.IN_REVIEW, note: "Design challenge assigned", createdById: admins.creative.id },
        { status: ApplicationStatus.INTERVIEW, note: "Panel interview completed", createdById: admins.creative.id },
        { status: ApplicationStatus.ACCEPTED, note: "Candidate signed offer letter", createdById: admins.creative.id },
      ],
      interview: {
        startsAt: addDays(-2),
        endsAt: new Date(addDays(-2).getTime() + hourMs),
        status: InterviewStatus.COMPLETED,
        createdById: admins.creative.id,
        updatedById: admins.creative.id,
        locationOrLink: "Onsite - Creative Studio HQ",
        notes: "Conducted design critique and case study presentation.",
      },
    },
    {
      key: "charlieProduct",
      data: { userId: charlie.id, jobId: jobs.productManager.id, cvUrl: "https://res.cloudinary.com/demo/cv/charlie-product.pdf", cvFileName: "charlie-product.pdf", cvFileSize: 205_000, expectedSalary: 28_000_000, expectedSalaryCurrency: "IDR", status: ApplicationStatus.REJECTED, reviewNote: "Looking for experience with enterprise lending products.", reviewUpdatedAt: now },
      attachments: [{ url: "https://res.cloudinary.com/demo/cv/charlie-case-study.pdf", fileName: "case-study.pdf", fileSize: 260_000 }],
      timeline: [
        { status: ApplicationStatus.SUBMITTED, note: "Application submitted", createdById: charlie.id },
        { status: ApplicationStatus.IN_REVIEW, note: "Initial screening complete", createdById: admins.fintech.id },
        { status: ApplicationStatus.REJECTED, note: "Not a fit for current opening", createdById: admins.fintech.id },
      ],
    },
    {
      key: "dianaMarketing",
      data: { userId: diana.id, jobId: jobs.marketingSpecialist.id, cvUrl: "https://res.cloudinary.com/demo/cv/diana-marketing.pdf", cvFileName: "diana-marketing.pdf", cvFileSize: 198_000, expectedSalary: 14_000_000, expectedSalaryCurrency: "IDR", status: ApplicationStatus.IN_REVIEW, referralSource: "Referral" },
      attachments: [{ url: "https://res.cloudinary.com/demo/cv/diana-campaign.pdf", fileName: "campaign-samples.pdf" }],
      timeline: [
        { status: ApplicationStatus.SUBMITTED, note: "Submitted via employee referral", createdById: diana.id },
        { status: ApplicationStatus.IN_REVIEW, note: "Awaiting marketing director feedback", createdById: admins.creative.id },
      ],
    },
    {
      key: "ekoCustomerSuccess",
      data: { userId: eko.id, jobId: jobs.customerSuccess.id, cvUrl: "https://res.cloudinary.com/demo/cv/eko-cs.pdf", cvFileName: "eko-cs.pdf", cvFileSize: 202_000, expectedSalary: 22_000_000, expectedSalaryCurrency: "IDR", status: ApplicationStatus.ACCEPTED, reviewNote: "Excellent leadership experience, offer extended", reviewUpdatedAt: now, referralSource: "Talent Pool" },
      timeline: [
        { status: ApplicationStatus.SUBMITTED, note: "Submitted for confidential opening", createdById: eko.id },
        { status: ApplicationStatus.IN_REVIEW, note: "Hiring manager reviewing leadership experience", createdById: admins.tech.id },
        { status: ApplicationStatus.ACCEPTED, note: "Offer letter sent and accepted", createdById: admins.tech.id },
      ],
    },
  ];

  const applications: Partial<Record<ApplicationKey, Application>> = {};

  for (const seed of applicationSeeds) {
    const applicationData: Prisma.ApplicationUncheckedCreateInput = {
      ...seed.data,
      timeline: { create: seed.timeline },
    };

    if (seed.attachments?.length) {
      applicationData.attachments = { create: seed.attachments };
    }

    const application = await prisma.application.create({ data: applicationData });

    applications[seed.key] = application;

    if (seed.interview) {
      await prisma.interview.create({ data: { applicationId: application.id, ...seed.interview } });
    }

    if (seed.preselection) {
      const result = await prisma.preselectionResult.create({
        data: {
          userId: seed.data.userId,
          testId: seed.preselection.testId,
          score: seed.preselection.score,
          passed: seed.preselection.passed,
        },
      });

      await recordApplicantAnswers({
        prisma,
        resultId: result.id,
        testId: seed.preselection.testId,
        correctCount: seed.preselection.correctCount,
      });
    }
  }

  return { applications: applications as Record<ApplicationKey, Application> };
}
