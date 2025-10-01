import { PrismaClient, ApplicationStatus, InterviewStatus, PaymentMethod, PaymentStatus, ProviderType, SharePlatform, UserRole } from "../generated/prisma";
import { hashPassword } from "../utils/hashPassword";

const prisma = new PrismaClient();

async function clearDatabase() {
  // Order matters due to FKs
  // Clean up potential legacy tables that may reference User (e.g., BadgeTemplate)
  try {
    await prisma.$executeRawUnsafe(`DO $$
    BEGIN
      IF EXISTS (
        SELECT 1 FROM information_schema.tables
        WHERE table_schema = 'public' AND table_name = 'BadgeTemplate'
      ) THEN
        EXECUTE 'DELETE FROM "BadgeTemplate"';
      END IF;
    END
    $$;`);
  } catch (e) {
    // ignore if DB doesn't have the table / permissions
  }

  await prisma.applicantAnswer.deleteMany();
  await prisma.preselectionResult.deleteMany();
  await prisma.preselectionQuestion.deleteMany();
  await prisma.preselectionTest.deleteMany();

  await prisma.interview.deleteMany();
  await prisma.application.deleteMany();
  await prisma.savedJob.deleteMany();
  await prisma.jobShare.deleteMany();

  await prisma.payment.deleteMany();
  await prisma.subscription.deleteMany();
  await prisma.subscriptionPlan.deleteMany();

  await prisma.companyReview.deleteMany();
  await prisma.employment.deleteMany();

  await prisma.skillResult.deleteMany();
  await prisma.skillQuestion.deleteMany();
  await prisma.skillAssessment.deleteMany();

  await prisma.generatedCV.deleteMany();
  await prisma.userBadge.deleteMany();
  await prisma.userProvider.deleteMany();

  await prisma.job.deleteMany();
  await prisma.company.deleteMany();
  // Delete users at the very end to satisfy restrictive relations like SkillAssessment.creator (onDelete: Restrict)
  await prisma.user.deleteMany();
}

async function seed() {
  console.log("Seeding database...");
  await clearDatabase();

  // Users
  const adminPassword = await hashPassword("admin123");
  const userPassword = await hashPassword("user12345");

  const admin = await prisma.user.create({
    data: {
      role: UserRole.ADMIN,
      name: "Admin Company",
      email: "admin@company.com",
      passwordHash: adminPassword,
      isVerified: true,
      city: "Jakarta",
    },
  });

  const alice = await prisma.user.create({
    data: {
      role: UserRole.USER,
      name: "Alice Hartono",
      email: "alice@example.com",
      passwordHash: userPassword,
      isVerified: true,
      city: "Bandung",
    },
  });

  const bob = await prisma.user.create({
    data: {
      role: UserRole.USER,
      name: "Bob Pratama",
      email: "bob@example.com",
      passwordHash: userPassword,
      isVerified: true,
      city: "Surabaya",
    },
  });

  const charlie = await prisma.user.create({
    data: {
      role: UserRole.USER,
      name: "Charlie Wijaya",
      email: "charlie@example.com",
      passwordHash: userPassword,
      isVerified: true,
      city: "Yogyakarta",
    },
  });

  // Providers
  await prisma.userProvider.create({
    data: {
      userId: alice.id,
      provider: ProviderType.GOOGLE,
      providerId: "google-oauth2|alice.demo",
      accessToken: "demo-token",
    },
  });
  await prisma.userProvider.create({
    data: {
      userId: bob.id,
      provider: ProviderType.FACEBOOK,
      providerId: "facebook|bob.demo",
      accessToken: "demo-token-fb",
    },
  });

  // Companies
  const demoCompany = await prisma.company.create({
    data: {
      name: "Demo Company",
      email: "admin@company.com",
      phone: "+6281234567890",
      location: "Jakarta, Indonesia",
      city: "Jakarta",
      description: "A demo company for testing purposes",
      website: "https://democompany.com",
      adminId: admin.id,
    },
  });

  const techStars = await prisma.company.create({
    data: {
      name: "TechStars ID",
      email: "hr@techstars.id",
      phone: "+628111111111",
      location: "Bandung, Indonesia",
      city: "Bandung",
      website: "https://techstars.id",
    },
  });

  const indieCo = await prisma.company.create({
    data: {
      name: "Indie Co",
      email: "contact@indie.co",
      phone: "+628122223333",
      location: "Yogyakarta, Indonesia",
      city: "Yogyakarta",
      website: "https://indie.co",
    },
  });

  // Jobs
  const jobFrontend = await prisma.job.create({
    data: {
      companyId: demoCompany.id,
      title: "Senior Frontend Engineer",
      description: "Build and maintain modern web applications with React/Next.js",
      category: "Engineering",
      city: "Jakarta",
      salaryMin: 20000000,
      salaryMax: 30000000,
      tags: ["react", "typescript", "nextjs"],
      isPublished: true,
      deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
    },
  });

  const jobDesigner = await prisma.job.create({
    data: {
      companyId: demoCompany.id,
      title: "UI/UX Designer",
      description: "Design user-centric experiences across web and mobile",
      category: "Design",
      city: "Bandung",
      salaryMin: 15000000,
      salaryMax: 25000000,
      tags: ["figma", "ux", "ui"],
      isPublished: false,
    },
  });

  const jobBackend = await prisma.job.create({
    data: {
      companyId: techStars.id,
      title: "Backend Developer",
      description: "Develop robust APIs and services with Node.js",
      category: "Engineering",
      city: "Surabaya",
      salaryMin: 18000000,
      salaryMax: 28000000,
      tags: ["node", "express", "prisma"],
      isPublished: true,
    },
  });

  const jobQa = await prisma.job.create({
    data: {
      companyId: indieCo.id,
      title: "QA Engineer",
      description: "Ensure product quality through testing and automation",
      category: "Engineering",
      city: "Yogyakarta",
      tags: ["qa", "automation", "cypress"],
      isPublished: true,
    },
  });

  // Preselection tests helper
  async function addPreselection(jobId: number, questionCount = 5, passingScore = 4) {
    const test = await prisma.preselectionTest.create({
      data: {
        jobId,
        isActive: true,
        passingScore,
      },
    });

    const questions = Array.from({ length: questionCount }).map((_, idx) => ({
      testId: test.id,
      question: `Question ${idx + 1}: Basic knowledge check`,
      options: ["A", "B", "C", "D"],
      answer: "A",
    }));
    await prisma.preselectionQuestion.createMany({ data: questions });
    return test;
  }

  const testFrontend = await addPreselection(jobFrontend.id, 25, 20);
  const testBackend = await addPreselection(jobBackend.id, 10, 7);
  const testQa = await addPreselection(jobQa.id, 3, 2);

  // Applications
  const appAliceFrontend = await prisma.application.create({
    data: {
      userId: alice.id,
      jobId: jobFrontend.id,
      cvFile: "uploads/alice_cv.pdf",
      expectedSalary: 24000000,
      status: ApplicationStatus.IN_REVIEW,
    },
  });

  const appBobBackend = await prisma.application.create({
    data: {
      userId: bob.id,
      jobId: jobBackend.id,
      cvFile: "uploads/bob_cv.pdf",
      expectedSalary: 22000000,
      status: ApplicationStatus.INTERVIEW,
    },
  });

  // Additional applications to cover every status
  await prisma.application.create({
    data: {
      userId: charlie.id,
      jobId: jobFrontend.id,
      cvFile: "uploads/charlie_cv.pdf",
      expectedSalary: 21000000,
      status: ApplicationStatus.SUBMITTED,
    },
  });
  await prisma.application.create({
    data: {
      userId: alice.id,
      jobId: jobBackend.id,
      cvFile: "uploads/alice_cv_backend.pdf",
      expectedSalary: 23000000,
      status: ApplicationStatus.ACCEPTED,
    },
  });
  await prisma.application.create({
    data: {
      userId: bob.id,
      jobId: jobFrontend.id,
      cvFile: "uploads/bob_cv_frontend.pdf",
      expectedSalary: 20000000,
      status: ApplicationStatus.REJECTED,
    },
  });

  // Interviews across all statuses
  await prisma.interview.create({
    data: {
      applicationId: appBobBackend.id,
      scheduleDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
      locationOrLink: "Google Meet",
      notes: "Technical round",
      status: InterviewStatus.SCHEDULED,
    },
  });
  await prisma.interview.create({
    data: {
      applicationId: appAliceFrontend.id,
      scheduleDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
      locationOrLink: "Zoom",
      notes: "Completed HR interview",
      status: InterviewStatus.COMPLETED,
      reminderSentAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
    },
  });
  await prisma.interview.create({
    data: {
      applicationId: appAliceFrontend.id,
      scheduleDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 1),
      locationOrLink: "Office",
      notes: "Cancelled due to conflict",
      status: InterviewStatus.CANCELLED,
    },
  });
  await prisma.interview.create({
    data: {
      applicationId: appBobBackend.id,
      scheduleDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1),
      locationOrLink: "Teams",
      notes: "Candidate no-show",
      status: InterviewStatus.NO_SHOW,
    },
  });

  // Subscriptions
  const basicPlan = await prisma.subscriptionPlan.create({
    data: {
      planName: "Basic",
      planPrice: "99000.00",
      planDescription: "Basic access for candidates",
    },
  });

  const proPlan = await prisma.subscriptionPlan.create({
    data: {
      planName: "Pro",
      planPrice: "199000.00",
      planDescription: "Pro access with extra features",
    },
  });

  const subAlice = await prisma.subscription.create({
    data: {
      userId: alice.id,
      subscriptionPlanId: proPlan.id,
      startDate: new Date(),
      endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
      isActive: true,
    },
  });

  await prisma.payment.create({
    data: {
      subscriptionId: subAlice.id,
      paymentMethod: PaymentMethod.TRANSFER,
      status: PaymentStatus.APPROVED,
      amount: "199000.00",
      approvedAt: new Date(),
    },
  });

  // Bob subscription with pending payment (transfer)
  const subBob = await prisma.subscription.create({
    data: {
      userId: bob.id,
      subscriptionPlanId: basicPlan.id,
      startDate: new Date(),
      endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14),
      isActive: false,
    },
  });
  await prisma.payment.create({
    data: {
      subscriptionId: subBob.id,
      paymentMethod: PaymentMethod.TRANSFER,
      status: PaymentStatus.PENDING,
      amount: "99000.00",
    },
  });

  // Additional payments to cover REJECTED and EXPIRED and GATEWAY method
  const subCharlie = await prisma.subscription.create({
    data: {
      userId: charlie.id,
      subscriptionPlanId: basicPlan.id,
      startDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10),
      endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 20),
      isActive: false,
    },
  });
  await prisma.payment.create({
    data: {
      subscriptionId: subCharlie.id,
      paymentMethod: PaymentMethod.GATEWAY,
      status: PaymentStatus.REJECTED,
      amount: "99000.00",
      gatewayTransactionId: "GW-REJ-001",
    },
  });
  const subCharlie2 = await prisma.subscription.create({
    data: {
      userId: charlie.id,
      subscriptionPlanId: proPlan.id,
      startDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 40),
      endDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10),
      isActive: false,
    },
  });
  await prisma.payment.create({
    data: {
      subscriptionId: subCharlie2.id,
      paymentMethod: PaymentMethod.GATEWAY,
      status: PaymentStatus.EXPIRED,
      amount: "199000.00",
      gatewayTransactionId: "GW-EXP-002",
      expiredAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 9),
    },
  });

  // Employment and reviews
  const empAlice = await prisma.employment.create({
    data: {
      userId: alice.id,
      companyId: demoCompany.id,
      startDate: new Date("2022-01-01"),
      endDate: new Date("2023-01-01"),
    },
  });

  await prisma.companyReview.create({
    data: {
      employmentId: empAlice.id,
      position: "Frontend Engineer",
      salaryEstimate: 20000000,
      cultureRating: 4,
      worklifeRating: 4,
      facilityRating: 4,
      careerRating: 4,
      comment: "Great learning environment",
    },
  });

  // Saved jobs and shares
  await prisma.savedJob.create({
    data: { userId: alice.id, jobId: jobBackend.id },
  });
  await prisma.savedJob.create({
    data: { userId: bob.id, jobId: jobFrontend.id },
  });
  await prisma.savedJob.create({
    data: { userId: charlie.id, jobId: jobDesigner.id },
  });

  await prisma.jobShare.create({
    data: { userId: alice.id, jobId: jobFrontend.id, platform: SharePlatform.LINKEDIN, sharedUrl: "https://linkedin.com/demo" },
  });
  await prisma.jobShare.create({
    data: { userId: bob.id, jobId: jobBackend.id, platform: SharePlatform.WHATSAPP, sharedUrl: "https://wa.me/demo" },
  });
  await prisma.jobShare.create({
    data: { userId: alice.id, jobId: jobBackend.id, platform: SharePlatform.FACEBOOK, sharedUrl: "https://facebook.com/demo" },
  });
  await prisma.jobShare.create({
    data: { userId: charlie.id, jobId: jobFrontend.id, platform: SharePlatform.TWITTER, sharedUrl: "https://x.com/demo" },
  });

  // Skill assessments
  const assessment = await prisma.skillAssessment.create({
    data: {
      title: "JavaScript Fundamentals",
      description: "Basic JS quiz",
      createdBy: admin.id,
    },
  });
  await prisma.skillQuestion.createMany({
    data: [
      { assessmentId: assessment.id, question: "What is closure?", options: ["A", "B", "C", "D"], answer: "A" },
      { assessmentId: assessment.id, question: "What is hoisting?", options: ["A", "B", "C", "D"], answer: "B" },
    ],
  });
  await prisma.skillResult.create({
    data: {
      userId: bob.id,
      assessmentId: assessment.id,
      score: 90,
      isPassed: true,
      certificateCode: "CERT-ABC123",
    },
  });

  // Badges and generated CVs
  await prisma.userBadge.create({
    data: { userId: alice.id, badgeName: "Top Applicant", badgeIcon: "🏅" },
  });
  await prisma.generatedCV.create({
    data: { userId: bob.id, fileUrl: "uploads/generated/bob_cv.pdf", templateUsed: "classic" },
  });
  await prisma.generatedCV.create({
    data: { userId: alice.id, fileUrl: "uploads/generated/alice_cv.pdf", templateUsed: "modern" },
  });

  // Preselection test results (simulate Alice took frontend test)
  const resultAlice = await prisma.preselectionResult.create({
    data: { userId: alice.id, testId: testFrontend.id, score: 5 },
  });
  const questionsFrontend = await prisma.preselectionQuestion.findMany({ where: { testId: testFrontend.id } });
  await prisma.applicantAnswer.createMany({
    data: questionsFrontend.map((q) => ({ resultId: resultAlice.id, questionId: q.id, selected: "A", isCorrect: true })),
  });

  // Failing result for Backend (10 Q, passing 7) → score 5
  const resultBobBackend = await prisma.preselectionResult.create({
    data: { userId: bob.id, testId: testBackend.id, score: 5 },
  });
  const questionsBackend = await prisma.preselectionQuestion.findMany({ where: { testId: testBackend.id } });
  await prisma.applicantAnswer.createMany({
    data: questionsBackend.map((q, idx) => ({
      resultId: resultBobBackend.id,
      questionId: q.id,
      selected: idx < 5 ? "A" : "B",
      isCorrect: idx < 5,
    })),
  });

  // QA tiny test (3 Q, passing 2) → score 2 boundary pass
  const resultCharlieQa = await prisma.preselectionResult.create({
    data: { userId: charlie.id, testId: testQa.id, score: 2 },
  });
  const questionsQa = await prisma.preselectionQuestion.findMany({ where: { testId: testQa.id } });
  await prisma.applicantAnswer.createMany({
    data: questionsQa.map((q, idx) => ({
      resultId: resultCharlieQa.id,
      questionId: q.id,
      selected: idx < 2 ? "A" : "B",
      isCorrect: idx < 2,
    })),
  });

  console.log("✅ Seeding completed.");
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });


