import { PrismaClient, ApplicationStatus, InterviewStatus, PaymentMethod, PaymentStatus, ProviderType, SharePlatform, UserRole } from "../generated/prisma";
import { hashPassword } from "../utils/hashPassword";

const prisma = new PrismaClient();

async function clearDatabase() {
  // Order matters due to FKs - delete in reverse dependency order
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
  await prisma.badgeTemplate.deleteMany();
  // Delete users at the very end to satisfy restrictive relations
  await prisma.user.deleteMany();
}

async function seed() {
  console.log("Seeding database...");
  await clearDatabase();

  // Users with comprehensive data
  const adminPassword = await hashPassword("admin123");
  const userPassword = await hashPassword("user12345");
  // Additional demo passwords for special scenarios
  const devPassword = await hashPassword("work00dev");
  const goldPassword = await hashPassword("gold12345");

  const admin = await prisma.user.create({
    data: {
      role: UserRole.ADMIN,
      name: "Admin Company",
      email: "admin@company.com",
      passwordHash: adminPassword,
      phone: "+6281234567890",
      gender: "Male",
      dob: new Date("1985-05-15"),
      education: "Master's in Computer Science",
      address: "Jl. Sudirman No. 123, Jakarta",
      profilePicture: "https://i.pravatar.cc/256?u=admin@company.com",
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
      phone: "+628111111111",
      gender: "Female",
      dob: new Date("1995-03-20"),
      education: "Bachelor's in Information Technology",
      address: "Jl. Dipatiukur No. 45, Bandung",
      profilePicture: "https://i.pravatar.cc/256?u=alice@example.com",
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
      phone: "+628222222222",
      gender: "Male",
      dob: new Date("1992-08-10"),
      education: "Bachelor's in Software Engineering",
      address: "Jl. Raya Darmo No. 78, Surabaya",
      profilePicture: "https://i.pravatar.cc/256?u=bob@example.com",
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
      phone: "+628333333333",
      gender: "Male",
      dob: new Date("1998-12-05"),
      education: "Bachelor's in Computer Science",
      address: "Jl. Malioboro No. 12, Yogyakarta",
      profilePicture: "https://i.pravatar.cc/256?u=charlie@example.com",
      isVerified: true,
      city: "Yogyakarta",
    },
  });

  const diana = await prisma.user.create({
    data: {
      role: UserRole.USER,
      name: "Diana Sari",
      email: "diana@example.com",
      passwordHash: userPassword,
      phone: "+628444444444",
      gender: "Female",
      dob: new Date("1993-07-18"),
      education: "Master's in Design",
      address: "Jl. Gatot Subroto No. 56, Jakarta",
      profilePicture: "https://i.pravatar.cc/256?u=diana@example.com",
      isVerified: true,
      city: "Jakarta",
    },
  });

  const eko = await prisma.user.create({
    data: {
      role: UserRole.USER,
      name: "Eko Santoso",
      email: "eko@example.com",
      passwordHash: userPassword,
      phone: "+628555555555",
      gender: "Male",
      dob: new Date("1990-11-25"),
      education: "Bachelor's in Information Systems",
      address: "Jl. Ahmad Yani No. 89, Medan",
      profilePicture: "https://i.pravatar.cc/256?u=eko@example.com",
      isVerified: false,
      city: "Medan",
    },
  });

  // Developer role user (enum coverage)
  const devUser = await prisma.user.create({
    data: {
      role: UserRole.DEVELOPER,
      name: "workoo developer",
      email: "workoo.dev@gmail.com",
      passwordHash: devPassword,
      phone: "+628566677788",
      gender: "Female",
      dob: new Date("1994-04-14"),
      education: "Bachelor's in Computer Engineering",
      address: "Jl. Asia Afrika No. 7, Bandung",
      profilePicture: "https://i.pravatar.cc/256?u=workoo.dev@gmail.com",
      isVerified: true,
      city: "Bandung",
    },
  });

  // Gold Plan demo user
  const ginaGold = await prisma.user.create({
    data: {
      role: UserRole.USER,
      name: "Gina Gold",
      email: "gina.gold@example.com",
      passwordHash: goldPassword,
      phone: "+628577744411",
      gender: "Female",
      dob: new Date("1996-06-16"),
      education: "Bachelor's in Business",
      address: "Jl. Thamrin No. 19, Jakarta",
      profilePicture: "https://i.pravatar.cc/256?u=gina.gold@example.com",
      isVerified: true,
      city: "Jakarta",
    },
  });

  // User Providers - More comprehensive OAuth data
  await prisma.userProvider.create({
    data: {
      userId: alice.id,
      provider: ProviderType.GOOGLE,
      providerId: "google-oauth2|alice.demo",
      accessToken: "demo-token-alice",
      refreshToken: "refresh-token-alice",
    },
  });
  await prisma.userProvider.create({
    data: {
      userId: bob.id,
      provider: ProviderType.GOOGLE,
      providerId: "google-oauth2|bob.demo",
      accessToken: "demo-token-fb-bob",
      refreshToken: "refresh-token-fb-bob",
    },
  });
  await prisma.userProvider.create({
    data: {
      userId: charlie.id,
      provider: ProviderType.GOOGLE,
      providerId: "google-oauth2|charlie.demo",
      accessToken: "demo-token-charlie",
    },
  });
  await prisma.userProvider.create({
    data: {
      userId: diana.id,
      provider: ProviderType.GOOGLE,
      providerId: "google-oauth2|diana.demo",
      accessToken: "demo-token-fb-diana",
    },
  });

  // Additional OAuth for admin account
  await prisma.userProvider.create({
    data: {
      userId: admin.id,
      provider: ProviderType.GOOGLE,
      providerId: "google-oauth2|admin.demo",
      accessToken: "demo-token-admin",
      refreshToken: "refresh-token-admin",
    },
  });

  // Companies - More comprehensive company data
  // Create dedicated admin for TechCorp so company.adminId matches an existing user
  const techCorpAdmin = await prisma.user.create({
    data: {
      role: UserRole.ADMIN,
      name: "TechCorp Admin",
      email: "admin@techcorp.id",
      passwordHash: adminPassword,
      city: "Jakarta",
      profilePicture: "https://i.pravatar.cc/256?u=admin@techcorp.id",
      isVerified: true,
    },
  });

  const demoCompany = await prisma.company.create({
    data: {
      name: "TechCorp Indonesia",
      email: "admin@techcorp.id",
      phone: "+6281234567890",
      location: "Jakarta, Indonesia",
      city: "Jakarta",
      description: "Leading technology company specializing in software development and digital solutions",
      website: "https://techcorp.id",
      logo: "https://placehold.co/128x128?text=TechCorp",
      adminId: techCorpAdmin.id,
    },
  });

  // Additional company admins
  const techStarsAdmin = await prisma.user.create({
    data: {
      role: UserRole.ADMIN,
      name: "TechStars Admin",
      email: "admin@techstars.id",
      passwordHash: adminPassword,
      city: "Bandung",
      profilePicture: "https://i.pravatar.cc/256?u=admin@techstars.id",
      isVerified: true,
    },
  });
  const indieAdmin = await prisma.user.create({
    data: {
      role: UserRole.ADMIN,
      name: "Indie Admin",
      email: "admin@indie.co",
      passwordHash: adminPassword,
      city: "Yogyakarta",
      profilePicture: "https://i.pravatar.cc/256?u=admin@indie.co",
      isVerified: true,
    },
  });
  const fintechAdmin = await prisma.user.create({
    data: {
      role: UserRole.ADMIN,
      name: "Fintech Admin",
      email: "admin@fintechcorp.com",
      passwordHash: adminPassword,
      city: "Surabaya",
      profilePicture: "https://i.pravatar.cc/256?u=admin@fintechcorp.com",
      isVerified: true,
    },
  });
  const designAdmin = await prisma.user.create({
    data: {
      role: UserRole.ADMIN,
      name: "Design Studio Admin",
      email: "admin@creativestudio.id",
      passwordHash: adminPassword,
      city: "Jakarta",
      profilePicture: "https://i.pravatar.cc/256?u=admin@creativestudio.id",
      isVerified: true,
    },
  });

  const techStars = await prisma.company.create({
    data: {
      name: "TechStars ID",
      email: "hr@techstars.id",
      phone: "+628111111111",
      location: "Bandung, Indonesia",
      city: "Bandung",
      description: "Innovative startup accelerator and technology company",
      website: "https://techstars.id",
      logo: "https://placehold.co/128x128?text=TechStars",
      adminId: techStarsAdmin.id,
    },
  });

  const indieCo = await prisma.company.create({
    data: {
      name: "Indie Co",
      email: "contact@indie.co",
      phone: "+628122223333",
      location: "Yogyakarta, Indonesia",
      city: "Yogyakarta",
      description: "Creative agency focused on design and digital marketing",
      website: "https://indie.co",
      logo: "https://placehold.co/128x128?text=Indie",
      adminId: indieAdmin.id,
    },
  });

  const fintechCorp = await prisma.company.create({
    data: {
      name: "FintechCorp",
      email: "careers@fintechcorp.com",
      phone: "+628133334444",
      location: "Surabaya, Indonesia",
      city: "Surabaya",
      description: "Financial technology company revolutionizing digital banking",
      website: "https://fintechcorp.com",
      logo: "https://placehold.co/128x128?text=Fintech",
      adminId: fintechAdmin.id,
    },
  });

  const designStudio = await prisma.company.create({
    data: {
      name: "Creative Design Studio",
      email: "hello@creativestudio.id",
      phone: "+628144445555",
      location: "Jakarta, Indonesia",
      city: "Jakarta",
      description: "Premium design studio specializing in UI/UX and branding",
      website: "https://creativestudio.id",
      logo: "https://placehold.co/128x128?text=Design",
      adminId: designAdmin.id,
    },
  });

  // Jobs - Comprehensive job listings
  const jobFrontend = await prisma.job.create({
    data: {
      companyId: demoCompany.id,
      title: "Senior Frontend Engineer",
      description: "Build and maintain modern web applications with React/Next.js. Lead frontend architecture decisions and mentor junior developers.",
      category: "Engineering",
      city: "Jakarta",
      salaryMin: 20000000,
      salaryMax: 30000000,
      tags: ["react", "typescript", "nextjs", "tailwind", "graphql"],
      banner: "https://example.com/frontend-job-banner.jpg",
      isPublished: true,
      deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
    },
  });

  const jobDesigner = await prisma.job.create({
    data: {
      companyId: designStudio.id,
      title: "Senior UI/UX Designer",
      description: "Design user-centric experiences across web and mobile platforms. Lead design system development and user research initiatives.",
      category: "Design",
      city: "Jakarta",
      salaryMin: 15000000,
      salaryMax: 25000000,
      tags: ["figma", "ux", "ui", "prototyping", "user-research"],
      banner: "https://example.com/designer-job-banner.jpg",
      isPublished: true,
      deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 45),
    },
  });

  const jobBackend = await prisma.job.create({
    data: {
      companyId: techStars.id,
      title: "Backend Developer",
      description: "Develop robust APIs and services with Node.js, Python, and cloud technologies. Work with microservices architecture.",
      category: "Engineering",
      city: "Bandung",
      salaryMin: 18000000,
      salaryMax: 28000000,
      tags: ["node", "python", "postgresql", "aws", "microservices"],
      banner: "https://example.com/backend-job-banner.jpg",
      isPublished: true,
      deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 20),
    },
  });

  const jobQa = await prisma.job.create({
    data: {
      companyId: indieCo.id,
      title: "QA Engineer",
      description: "Ensure product quality through testing and automation. Develop test strategies and maintain CI/CD pipelines.",
      category: "Engineering",
      city: "Yogyakarta",
      salaryMin: 12000000,
      salaryMax: 20000000,
      tags: ["qa", "automation", "cypress", "jest", "ci-cd"],
      banner: "https://example.com/qa-job-banner.jpg",
      isPublished: true,
      deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 15),
    },
  });

  const jobDevOps = await prisma.job.create({
    data: {
      companyId: fintechCorp.id,
      title: "DevOps Engineer",
      description: "Manage cloud infrastructure and deployment pipelines. Ensure system reliability and scalability.",
      category: "Engineering",
      city: "Surabaya",
      salaryMin: 22000000,
      salaryMax: 35000000,
      tags: ["aws", "docker", "kubernetes", "terraform", "monitoring"],
      banner: "https://example.com/devops-job-banner.jpg",
      isPublished: true,
      deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 25),
    },
  });

  const jobDataScientist = await prisma.job.create({
    data: {
      companyId: demoCompany.id,
      title: "Data Scientist",
      description: "Analyze complex datasets and build machine learning models to drive business insights.",
      category: "Data Science",
      city: "Jakarta",
      salaryMin: 25000000,
      salaryMax: 40000000,
      tags: ["python", "machine-learning", "pandas", "tensorflow", "sql"],
      banner: "https://example.com/datascience-job-banner.jpg",
      isPublished: true,
      deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 40),
    },
  });

  const jobProductManager = await prisma.job.create({
    data: {
      companyId: techStars.id,
      title: "Product Manager",
      description: "Lead product strategy and roadmap development. Collaborate with cross-functional teams to deliver exceptional user experiences.",
      category: "Product",
      city: "Bandung",
      salaryMin: 20000000,
      salaryMax: 30000000,
      tags: ["product-management", "agile", "user-research", "analytics", "strategy"],
      banner: "https://example.com/pm-job-banner.jpg",
      isPublished: true,
      deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 35),
    },
  });

  const jobMarketing = await prisma.job.create({
    data: {
      companyId: indieCo.id,
      title: "Digital Marketing Specialist",
      description: "Develop and execute digital marketing campaigns across multiple channels. Analyze performance and optimize ROI.",
      category: "Marketing",
      city: "Yogyakarta",
      salaryMin: 10000000,
      salaryMax: 18000000,
      tags: ["digital-marketing", "seo", "social-media", "analytics", "content"],
      banner: "https://example.com/marketing-job-banner.jpg",
      isPublished: false,
      deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 50),
    },
  });

  // Preselection tests helper with more realistic questions
  async function addPreselection(jobId: string, questionCount = 5, passingScore = 4, jobTitle: string) {
    const test = await prisma.preselectionTest.create({
      data: {
        jobId,
        isActive: true,
        passingScore,
      },
    });

    const questions = Array.from({ length: questionCount }).map((_, idx) => ({
      testId: test.id,
      question: `${jobTitle} - Question ${idx + 1}: What is the primary purpose of ${jobTitle.toLowerCase()}?`,
      options: ["Option A", "Option B", "Option C", "Option D"],
      answer: "Option A",
    }));
    await prisma.preselectionQuestion.createMany({ data: questions });
    return test;
  }

  const testFrontend = await addPreselection(jobFrontend.id, 25, 20, "Frontend Development");
  const testBackend = await addPreselection(jobBackend.id, 15, 12, "Backend Development");
  const testQa = await addPreselection(jobQa.id, 10, 7, "Quality Assurance");
  const testDevOps = await addPreselection(jobDevOps.id, 20, 15, "DevOps Engineering");
  const testDataScience = await addPreselection(jobDataScientist.id, 18, 14, "Data Science");
  const testProduct = await addPreselection(jobProductManager.id, 12, 9, "Product Management");

  // Additional preselection cases
  // Inactive test for Marketing job
  const testMarketingInactive = await prisma.preselectionTest.create({
    data: {
      jobId: jobMarketing.id,
      isActive: false,
      passingScore: 18,
    },
  });

  // Active test with no passingScore for Designer job
  const testDesignerNoThreshold = await prisma.preselectionTest.create({
    data: {
      jobId: jobDesigner.id,
      isActive: true,
    },
  });
  const designerQuestions = Array.from({ length: 25 }).map((_, idx) => ({
    testId: testDesignerNoThreshold.id,
    question: `Design Concepts Q${idx + 1}`,
    options: ["Option A", "Option B", "Option C", "Option D"],
    answer: "Option A",
  }));
  await prisma.preselectionQuestion.createMany({ data: designerQuestions });

  // Applications - Comprehensive application data covering all statuses
  const appAliceFrontend = await prisma.application.create({
    data: {
      userId: alice.id,
      jobId: jobFrontend.id,
      cvFile: "uploads/alice_cv.pdf",
      expectedSalary: 24000000,
      status: ApplicationStatus.IN_REVIEW,
      reviewNote: "Strong technical background, good portfolio",
    },
  });

  const appBobBackend = await prisma.application.create({
    data: {
      userId: bob.id,
      jobId: jobBackend.id,
      cvFile: "uploads/bob_cv.pdf",
      expectedSalary: 22000000,
      status: ApplicationStatus.INTERVIEW,
      reviewNote: "Excellent backend experience, scheduled for technical interview",
    },
  });

  const appCharlieDesigner = await prisma.application.create({
    data: {
      userId: charlie.id,
      jobId: jobDesigner.id,
      cvFile: "uploads/charlie_cv.pdf",
      expectedSalary: 18000000,
      status: ApplicationStatus.SUBMITTED,
    },
  });

  const appDianaDataScientist = await prisma.application.create({
    data: {
      userId: diana.id,
      jobId: jobDataScientist.id,
      cvFile: "uploads/diana_cv.pdf",
      expectedSalary: 28000000,
      status: ApplicationStatus.ACCEPTED,
      reviewNote: "Outstanding data science skills, perfect fit for the role",
    },
  });

  const appEkoDevOps = await prisma.application.create({
    data: {
      userId: eko.id,
      jobId: jobDevOps.id,
      cvFile: "uploads/eko_cv.pdf",
      expectedSalary: 25000000,
      status: ApplicationStatus.REJECTED,
      reviewNote: "Good technical skills but lacks cloud experience",
    },
  });

  const appAliceProduct = await prisma.application.create({
    data: {
      userId: alice.id,
      jobId: jobProductManager.id,
      cvFile: "uploads/alice_cv_product.pdf",
      expectedSalary: 22000000,
      status: ApplicationStatus.IN_REVIEW,
    },
  });

  const appBobQa = await prisma.application.create({
    data: {
      userId: bob.id,
      jobId: jobQa.id,
      cvFile: "uploads/bob_cv_qa.pdf",
      expectedSalary: 15000000,
      status: ApplicationStatus.SUBMITTED,
    },
  });

  const appCharlieMarketing = await prisma.application.create({
    data: {
      userId: charlie.id,
      jobId: jobMarketing.id,
      cvFile: "uploads/charlie_cv_marketing.pdf",
      expectedSalary: 12000000,
      status: ApplicationStatus.INTERVIEW,
    },
  });

  // Interviews - Comprehensive interview data covering all statuses
  await prisma.interview.create({
    data: {
      applicationId: appBobBackend.id,
      scheduleDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
      locationOrLink: "Google Meet - https://meet.google.com/abc-def-ghi",
      notes: "Technical round - System design and coding challenges",
      status: InterviewStatus.SCHEDULED,
    },
  });

  await prisma.interview.create({
    data: {
      applicationId: appAliceFrontend.id,
      scheduleDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
      locationOrLink: "Zoom - https://zoom.us/j/123456789",
      notes: "Completed HR interview - Great cultural fit",
      status: InterviewStatus.COMPLETED,
      reminderSentAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
    },
  });

  await prisma.interview.create({
    data: {
      applicationId: appCharlieMarketing.id,
      scheduleDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3),
      locationOrLink: "Office - Meeting Room A",
      notes: "Marketing strategy discussion",
      status: InterviewStatus.SCHEDULED,
    },
  });

  await prisma.interview.create({
    data: {
      applicationId: appAliceProduct.id,
      scheduleDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
      locationOrLink: "Microsoft Teams",
      notes: "Cancelled due to scheduling conflict",
      status: InterviewStatus.CANCELLED,
    },
  });

  await prisma.interview.create({
    data: {
      applicationId: appBobQa.id,
      scheduleDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1),
      locationOrLink: "Google Meet",
      notes: "Candidate did not show up",
      status: InterviewStatus.NO_SHOW,
    },
  });

  // Multi-round interview for the same application (Bob - Backend)
  await prisma.interview.create({
    data: {
      applicationId: appBobBackend.id,
      scheduleDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 10),
      locationOrLink: "Onsite - TechCorp HQ",
      notes: "Final round - leadership and team fit",
      status: InterviewStatus.SCHEDULED,
    },
  });

  // Subscription Plans - Comprehensive subscription options
  const basicPlan = await prisma.subscriptionPlan.create({
    data: {
      planName: "STANDARD",
      planPrice: "99000.00",
      planDescription: "Standard access for candidates",
    },
  });

  const proPlan = await prisma.subscriptionPlan.create({
    data: {
      planName: "PROFESSIONAL",
      planPrice: "299000.00",
      planDescription: "Professional access with extra features",
    },
  });

  // Subscriptions - Comprehensive subscription data
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
      amount: "299000.00",
      approvedAt: new Date(),
      paymentProof: "uploads/payment-proof-alice.jpg",
    },
  });

  // Bob subscription with pending payment
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
      paymentProof: "uploads/payment-proof-bob.jpg",
    },
  });

  // Bob upgraded to Pro with approved payment (multiple subscriptions per user)
  const subBobPro = await prisma.subscription.create({
    data: {
      userId: bob.id,
      subscriptionPlanId: proPlan.id,
      startDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 1),
      endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 31),
      isActive: true,
    },
  });
  await prisma.payment.create({
    data: {
      subscriptionId: subBobPro.id,
      paymentMethod: PaymentMethod.TRANSFER,
      status: PaymentStatus.APPROVED,
      amount: "299000.00",
      approvedAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 1),
    },
  });

  // Charlie subscription with rejected payment
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

  // Diana subscription with expired payment
  const subDiana = await prisma.subscription.create({
    data: {
      userId: diana.id,
      subscriptionPlanId: proPlan.id,
      startDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 40),
      endDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10),
      isActive: false,
    },
  });
  await prisma.payment.create({
    data: {
      subscriptionId: subDiana.id,
      paymentMethod: PaymentMethod.GATEWAY,
      status: PaymentStatus.EXPIRED,
      amount: "299000.00",
      gatewayTransactionId: "GW-EXP-002",
      expiredAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 9),
    },
  });

  // Eko subscription with approved gateway payment
  const subEko = await prisma.subscription.create({
    data: {
      userId: eko.id,
      subscriptionPlanId: proPlan.id,
      startDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
      endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 25),
      isActive: true,
    },
  });
  await prisma.payment.create({
    data: {
      subscriptionId: subEko.id,
      paymentMethod: PaymentMethod.GATEWAY,
      status: PaymentStatus.APPROVED,
      amount: "299000.00",
      gatewayTransactionId: "GW-APP-003",
      approvedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
    },
  });

  // Gold subscriber with approved gateway payment
  const subGinaGold = await prisma.subscription.create({
    data: {
      userId: ginaGold.id,
      subscriptionPlanId: proPlan.id,
      startDate: new Date(),
      endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
      isActive: true,
    },
  });
  await prisma.payment.create({
    data: {
      subscriptionId: subGinaGold.id,
      paymentMethod: PaymentMethod.GATEWAY,
      status: PaymentStatus.APPROVED,
      amount: "299000.00",
      gatewayTransactionId: "GW-GOLD-001",
      approvedAt: new Date(),
    },
  });

  // Employment and Company Reviews - Comprehensive employment history
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
      cultureRating: 4.5,
      worklifeRating: 4.2,
      facilityRating: 4.0,
      careerRating: 4.3,
      companyRating: 4.2,
      comment: "Great learning environment with supportive team. Good work-life balance and opportunities for growth.",
    },
  });

  const empBob = await prisma.employment.create({
    data: {
      userId: bob.id,
      companyId: techStars.id,
      startDate: new Date("2021-06-01"),
      endDate: new Date("2023-12-01"),
    },
  });

  await prisma.companyReview.create({
    data: {
      employmentId: empBob.id,
      position: "Backend Developer",
      salaryEstimate: 18000000,
      cultureRating: 3.8,
      worklifeRating: 3.5,
      facilityRating: 4.2,
      careerRating: 4.0,
      companyRating: 3.9,
      comment: "Fast-paced environment with good technical challenges. Sometimes long hours but great learning opportunities.",
    },
  });

  const empCharlie = await prisma.employment.create({
    data: {
      userId: charlie.id,
      companyId: indieCo.id,
      startDate: new Date("2023-03-01"),
      endDate: null, // Current employment
    },
  });

  await prisma.companyReview.create({
    data: {
      employmentId: empCharlie.id,
      position: "UI/UX Designer",
      salaryEstimate: 15000000,
      cultureRating: 4.8,
      worklifeRating: 4.5,
      facilityRating: 4.3,
      careerRating: 4.6,
      companyRating: 4.6,
      comment: "Amazing creative environment with flexible working hours. Great team culture and management support.",
    },
  });

  const empDiana = await prisma.employment.create({
    data: {
      userId: diana.id,
      companyId: fintechCorp.id,
      startDate: new Date("2020-09-01"),
      endDate: new Date("2022-08-01"),
    },
  });

  await prisma.companyReview.create({
    data: {
      employmentId: empDiana.id,
      position: "Data Scientist",
      salaryEstimate: 25000000,
      cultureRating: 3.5,
      worklifeRating: 3.0,
      facilityRating: 4.5,
      careerRating: 4.2,
      companyRating: 3.8,
      comment: "High-pressure environment with demanding deadlines. Good compensation but limited work-life balance.",
    },
  });

  // Freelance employment example (no company associated)
  const empEkoFreelance = await prisma.employment.create({
    data: {
      userId: eko.id,
      companyId: null,
      startDate: new Date("2021-02-01"),
      endDate: new Date("2021-12-01"),
    },
  });
  await prisma.companyReview.create({
    data: {
      employmentId: empEkoFreelance.id,
      position: "Freelance DevOps Engineer",
      salaryEstimate: 12000000,
      cultureRating: 4.0,
      worklifeRating: 4.2,
      facilityRating: 3.5,
      careerRating: 3.8,
      companyRating: 3.9,
      comment: "Flexible hours and variety of projects.",
    },
  });

  // Saved jobs and shares - Comprehensive job interaction data
  await prisma.savedJob.create({
    data: { userId: alice.id, jobId: jobBackend.id },
  });
  await prisma.savedJob.create({
    data: { userId: alice.id, jobId: jobDataScientist.id },
  });
  await prisma.savedJob.create({
    data: { userId: bob.id, jobId: jobFrontend.id },
  });
  await prisma.savedJob.create({
    data: { userId: bob.id, jobId: jobDevOps.id },
  });
  await prisma.savedJob.create({
    data: { userId: charlie.id, jobId: jobDesigner.id },
  });
  await prisma.savedJob.create({
    data: { userId: charlie.id, jobId: jobMarketing.id },
  });
  await prisma.savedJob.create({
    data: { userId: diana.id, jobId: jobProductManager.id },
  });
  await prisma.savedJob.create({
    data: { userId: eko.id, jobId: jobQa.id },
  });

  // Job shares across all platforms
  await prisma.jobShare.create({
    data: { 
      userId: alice.id, 
      jobId: jobFrontend.id, 
      platform: SharePlatform.LINKEDIN, 
      sharedUrl: "https://linkedin.com/posts/job-frontend-engineer",
      customMessage: "Great opportunity for frontend developers!"
    },
  });
  await prisma.jobShare.create({
    data: { 
      userId: bob.id, 
      jobId: jobBackend.id, 
      platform: SharePlatform.WHATSAPP, 
      sharedUrl: "https://wa.me/share?text=Backend%20Developer%20Position",
      customMessage: "Check out this backend role!"
    },
  });
  await prisma.jobShare.create({
    data: { 
      userId: alice.id, 
      jobId: jobBackend.id, 
      platform: SharePlatform.FACEBOOK, 
      sharedUrl: "https://facebook.com/sharer/sharer.php?u=job-backend",
      customMessage: "Sharing this amazing backend opportunity"
    },
  });
  await prisma.jobShare.create({
    data: { 
      userId: charlie.id, 
      jobId: jobFrontend.id, 
      platform: SharePlatform.TWITTER, 
      sharedUrl: "https://twitter.com/intent/tweet?text=Frontend%20Engineer%20Job",
      customMessage: "Exciting frontend role available!"
    },
  });
  await prisma.jobShare.create({
    data: { 
      userId: diana.id, 
      jobId: jobDataScientist.id, 
      platform: SharePlatform.LINKEDIN, 
      sharedUrl: "https://linkedin.com/posts/job-data-scientist",
      customMessage: "Perfect for data science professionals"
    },
  });
  await prisma.jobShare.create({
    data: { 
      userId: eko.id, 
      jobId: jobDevOps.id, 
      platform: SharePlatform.WHATSAPP, 
      sharedUrl: "https://wa.me/share?text=DevOps%20Engineer%20Position",
      customMessage: "DevOps opportunity here!"
    },
  });

  // Share without URL (optional field)
  await prisma.jobShare.create({
    data: {
      userId: charlie.id,
      jobId: jobMarketing.id,
      platform: SharePlatform.TWITTER,
      sharedUrl: null,
      customMessage: "Interesting marketing role – check it out!",
    },
  });

  // Badge Templates - Create comprehensive badge system
  const jsBadge = await prisma.badgeTemplate.create({
    data: {
      name: "JavaScript Expert",
      icon: "🟨",
      description: "Master of JavaScript programming",
      category: "Programming",
      createdBy: admin.id,
    },
  });

  const reactBadge = await prisma.badgeTemplate.create({
    data: {
      name: "React Specialist",
      icon: "⚛️",
      description: "Expert in React framework",
      category: "Frontend",
      createdBy: admin.id,
    },
  });

  const dataScienceBadge = await prisma.badgeTemplate.create({
    data: {
      name: "Data Science Pro",
      icon: "📊",
      description: "Advanced data science skills",
      category: "Data Science",
      createdBy: admin.id,
    },
  });

  const designBadge = await prisma.badgeTemplate.create({
    data: {
      name: "UI/UX Master",
      icon: "🎨",
      description: "Expert in user interface design",
      category: "Design",
      createdBy: admin.id,
    },
  });

  // Skill Assessments - Comprehensive skill testing system
  const jsAssessment = await prisma.skillAssessment.create({
    data: {
      title: "JavaScript Fundamentals",
      description: "Comprehensive JavaScript knowledge test covering ES6+, async programming, and modern patterns",
      createdBy: admin.id,
      badgeTemplateId: jsBadge.id,
    },
  });

  const reactAssessment = await prisma.skillAssessment.create({
    data: {
      title: "React Advanced",
      description: "Advanced React concepts including hooks, context, performance optimization, and testing",
      createdBy: admin.id,
      badgeTemplateId: reactBadge.id,
    },
  });

  const dataScienceAssessment = await prisma.skillAssessment.create({
    data: {
      title: "Data Science Fundamentals",
      description: "Machine learning, statistics, and data analysis skills assessment",
      createdBy: admin.id,
      badgeTemplateId: dataScienceBadge.id,
    },
  });

  const designAssessment = await prisma.skillAssessment.create({
    data: {
      title: "UI/UX Design Principles",
      description: "User experience design, wireframing, prototyping, and design thinking assessment",
      createdBy: admin.id,
      badgeTemplateId: designBadge.id,
    },
  });

  // Skill Questions for JavaScript Assessment
  await prisma.skillQuestion.createMany({
    data: [
      { 
        assessmentId: jsAssessment.id, 
        question: "What is closure in JavaScript?", 
        options: ["A function inside another function", "A variable scope", "A memory leak", "A design pattern"], 
        answer: "A function inside another function" 
      },
      { 
        assessmentId: jsAssessment.id, 
        question: "What is hoisting in JavaScript?", 
        options: ["Variable declaration", "Function declaration", "Both A and B", "None of the above"], 
        answer: "Both A and B" 
      },
      { 
        assessmentId: jsAssessment.id, 
        question: "What is the difference between let and var?", 
        options: ["No difference", "let is block-scoped", "var is block-scoped", "Both are function-scoped"], 
        answer: "let is block-scoped" 
      },
    ],
  });

  // Skill Questions for React Assessment
  await prisma.skillQuestion.createMany({
    data: [
      { 
        assessmentId: reactAssessment.id, 
        question: "What is the purpose of useEffect hook?", 
        options: ["State management", "Side effects", "Event handling", "Component mounting"], 
        answer: "Side effects" 
      },
      { 
        assessmentId: reactAssessment.id, 
        question: "What is JSX?", 
        options: ["JavaScript XML", "Java syntax", "JSON extension", "XML syntax"], 
        answer: "JavaScript XML" 
      },
    ],
  });

  // Skill Questions for Data Science Assessment
  await prisma.skillQuestion.createMany({
    data: [
      { 
        assessmentId: dataScienceAssessment.id, 
        question: "What is overfitting in machine learning?", 
        options: ["Model too simple", "Model too complex", "Perfect fit", "No correlation"], 
        answer: "Model too complex" 
      },
      { 
        assessmentId: dataScienceAssessment.id, 
        question: "What is cross-validation?", 
        options: ["Data splitting", "Model training", "Feature selection", "Data cleaning"], 
        answer: "Data splitting" 
      },
    ],
  });

  // Skill Questions for Design Assessment
  await prisma.skillQuestion.createMany({
    data: [
      { 
        assessmentId: designAssessment.id, 
        question: "What is the primary goal of user experience design?", 
        options: ["Visual appeal", "User satisfaction", "Technical performance", "Cost efficiency"], 
        answer: "User satisfaction" 
      },
      { 
        assessmentId: designAssessment.id, 
        question: "What is a wireframe?", 
        options: ["Final design", "Low-fidelity prototype", "High-fidelity prototype", "Color scheme"], 
        answer: "Low-fidelity prototype" 
      },
    ],
  });

  // Skill Results - Comprehensive test results
  await prisma.skillResult.create({
    data: {
      userId: bob.id,
      assessmentId: jsAssessment.id,
      score: 90,
      isPassed: true,
      certificateCode: "CERT-JS-001",
      certificateUrl: "https://example.com/certificates/bob-js-cert.pdf",
      startedAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
      finishedAt: new Date(Date.now() - 1000 * 60 * 60 * 1),
    },
  });

  await prisma.skillResult.create({
    data: {
      userId: alice.id,
      assessmentId: reactAssessment.id,
      score: 85,
      isPassed: true,
      certificateCode: "CERT-REACT-002",
      certificateUrl: "https://example.com/certificates/alice-react-cert.pdf",
      startedAt: new Date(Date.now() - 1000 * 60 * 60 * 3),
      finishedAt: new Date(Date.now() - 1000 * 60 * 60 * 1.5),
    },
  });

  await prisma.skillResult.create({
    data: {
      userId: diana.id,
      assessmentId: dataScienceAssessment.id,
      score: 95,
      isPassed: true,
      certificateCode: "CERT-DS-003",
      certificateUrl: "https://example.com/certificates/diana-ds-cert.pdf",
      startedAt: new Date(Date.now() - 1000 * 60 * 60 * 4),
      finishedAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
    },
  });

  await prisma.skillResult.create({
    data: {
      userId: charlie.id,
      assessmentId: designAssessment.id,
      score: 88,
      isPassed: true,
      certificateCode: "CERT-DESIGN-004",
      certificateUrl: "https://example.com/certificates/charlie-design-cert.pdf",
      startedAt: new Date(Date.now() - 1000 * 60 * 60 * 2.5),
      finishedAt: new Date(Date.now() - 1000 * 60 * 60 * 1),
    },
  });

  await prisma.skillResult.create({
    data: {
      userId: eko.id,
      assessmentId: jsAssessment.id,
      score: 65,
      isPassed: false,
      startedAt: new Date(Date.now() - 1000 * 60 * 60 * 1.5),
      finishedAt: new Date(Date.now() - 1000 * 60 * 60 * 0.5),
    },
  });

  // User Badges - Comprehensive badge system
  await prisma.userBadge.create({
    data: { 
      userId: alice.id, 
      badgeName: "Top Applicant", 
      badgeIcon: "🏅",
      badgeType: "achievement",
      assessmentId: reactAssessment.id,
      badgeTemplateId: reactBadge.id,
    },
  });

  await prisma.userBadge.create({
    data: { 
      userId: bob.id, 
      badgeName: "JavaScript Expert", 
      badgeIcon: "🟨",
      badgeType: "skill",
      assessmentId: jsAssessment.id,
      badgeTemplateId: jsBadge.id,
    },
  });

  await prisma.userBadge.create({
    data: { 
      userId: diana.id, 
      badgeName: "Data Science Pro", 
      badgeIcon: "📊",
      badgeType: "skill",
      assessmentId: dataScienceAssessment.id,
      badgeTemplateId: dataScienceBadge.id,
    },
  });

  await prisma.userBadge.create({
    data: { 
      userId: charlie.id, 
      badgeName: "UI/UX Master", 
      badgeIcon: "🎨",
      badgeType: "skill",
      assessmentId: designAssessment.id,
      badgeTemplateId: designBadge.id,
    },
  });

  await prisma.userBadge.create({
    data: { 
      userId: alice.id, 
      badgeName: "Early Adopter", 
      badgeIcon: "🚀",
      badgeType: "achievement",
    },
  });

  await prisma.userBadge.create({
    data: { 
      userId: eko.id, 
      badgeName: "Enterprise User", 
      badgeIcon: "🏢",
      badgeType: "subscription",
    },
  });

  // Generated CVs - Comprehensive CV generation data
  await prisma.generatedCV.create({
    data: { 
      userId: bob.id, 
      fileUrl: "uploads/generated/bob_cv.pdf", 
      templateUsed: "classic",
      additionalInfo: {
        skills: ["JavaScript", "Node.js", "React"],
        experience: "3 years",
        education: "Bachelor's in Computer Science"
      }
    },
  });

  await prisma.generatedCV.create({
    data: { 
      userId: alice.id, 
      fileUrl: "uploads/generated/alice_cv.pdf", 
      templateUsed: "modern",
      additionalInfo: {
        skills: ["React", "TypeScript", "Next.js"],
        experience: "2 years",
        education: "Bachelor's in Information Technology"
      }
    },
  });

  await prisma.generatedCV.create({
    data: { 
      userId: charlie.id, 
      fileUrl: "uploads/generated/charlie_cv.pdf", 
      templateUsed: "creative",
      additionalInfo: {
        skills: ["UI/UX Design", "Figma", "Adobe Creative Suite"],
        experience: "1 year",
        education: "Bachelor's in Computer Science"
      }
    },
  });

  await prisma.generatedCV.create({
    data: { 
      userId: diana.id, 
      fileUrl: "uploads/generated/diana_cv.pdf", 
      templateUsed: "professional",
      additionalInfo: {
        skills: ["Python", "Machine Learning", "Data Analysis"],
        experience: "3 years",
        education: "Master's in Design"
      }
    },
  });

  await prisma.generatedCV.create({
    data: { 
      userId: eko.id, 
      fileUrl: "uploads/generated/eko_cv.pdf", 
      templateUsed: "minimal",
      additionalInfo: {
        skills: ["DevOps", "AWS", "Docker"],
        experience: "4 years",
        education: "Bachelor's in Information Systems"
      }
    },
  });

  await prisma.generatedCV.create({
    data: { 
      userId: devUser.id, 
      fileUrl: "uploads/generated/dev_cv.pdf", 
      templateUsed: "modern",
      additionalInfo: {
        skills: ["TypeScript", "Node.js", "CI/CD"],
        experience: "5 years",
        education: "Bachelor's in Computer Engineering"
      }
    },
  });

  // Preselection test results - Comprehensive test results covering all scenarios
  const resultAliceFrontend = await prisma.preselectionResult.create({
    data: { userId: alice.id, testId: testFrontend.id, score: 22 }, // Pass (20+ required)
  });
  const questionsFrontend = await prisma.preselectionQuestion.findMany({ where: { testId: testFrontend.id } });
  await prisma.applicantAnswer.createMany({
    data: questionsFrontend.map((q, idx) => ({ 
      resultId: resultAliceFrontend.id, 
      questionId: q.id, 
      selected: idx < 22 ? "Option A" : "Option B", 
      isCorrect: idx < 22 
    })),
  });

  // Bob passes Frontend test
  const resultBobFrontend = await prisma.preselectionResult.create({
    data: { userId: bob.id, testId: testFrontend.id, score: 24 }, // Pass
  });
  await prisma.applicantAnswer.createMany({
    data: questionsFrontend.map((q, idx) => ({
      resultId: resultBobFrontend.id,
      questionId: q.id,
      selected: idx < 24 ? "Option A" : "Option B",
      isCorrect: idx < 24,
    })),
  });

  // Bob fails Backend test
  const resultBobBackend = await prisma.preselectionResult.create({
    data: { userId: bob.id, testId: testBackend.id, score: 8 }, // Fail (12+ required)
  });
  const questionsBackend = await prisma.preselectionQuestion.findMany({ where: { testId: testBackend.id } });
  await prisma.applicantAnswer.createMany({
    data: questionsBackend.map((q, idx) => ({
      resultId: resultBobBackend.id,
      questionId: q.id,
      selected: idx < 8 ? "Option A" : "Option B",
      isCorrect: idx < 8,
    })),
  });

  // Charlie passes QA test
  const resultCharlieQa = await prisma.preselectionResult.create({
    data: { userId: charlie.id, testId: testQa.id, score: 8 }, // Pass (7+ required)
  });
  const questionsQa = await prisma.preselectionQuestion.findMany({ where: { testId: testQa.id } });
  await prisma.applicantAnswer.createMany({
    data: questionsQa.map((q, idx) => ({
      resultId: resultCharlieQa.id,
      questionId: q.id,
      selected: idx < 8 ? "Option A" : "Option B",
      isCorrect: idx < 8,
    })),
  });

  // Diana passes Data Science test
  const resultDianaDataScience = await prisma.preselectionResult.create({
    data: { userId: diana.id, testId: testDataScience.id, score: 16 }, // Pass (14+ required)
  });
  const questionsDataScience = await prisma.preselectionQuestion.findMany({ where: { testId: testDataScience.id } });
  await prisma.applicantAnswer.createMany({
    data: questionsDataScience.map((q, idx) => ({
      resultId: resultDianaDataScience.id,
      questionId: q.id,
      selected: idx < 16 ? "Option A" : "Option B",
      isCorrect: idx < 16,
    })),
  });

  // Eko passes DevOps test
  const resultEkoDevOps = await prisma.preselectionResult.create({
    data: { userId: eko.id, testId: testDevOps.id, score: 17 }, // Pass (15+ required)
  });
  const questionsDevOps = await prisma.preselectionQuestion.findMany({ where: { testId: testDevOps.id } });
  await prisma.applicantAnswer.createMany({
    data: questionsDevOps.map((q, idx) => ({
      resultId: resultEkoDevOps.id,
      questionId: q.id,
      selected: idx < 17 ? "Option A" : "Option B",
      isCorrect: idx < 17,
    })),
  });

  // Alice fails Product Management test
  const resultAliceProduct = await prisma.preselectionResult.create({
    data: { userId: alice.id, testId: testProduct.id, score: 6 }, // Fail (9+ required)
  });
  const questionsProduct = await prisma.preselectionQuestion.findMany({ where: { testId: testProduct.id } });
  await prisma.applicantAnswer.createMany({
    data: questionsProduct.map((q, idx) => ({
      resultId: resultAliceProduct.id,
      questionId: q.id,
      selected: idx < 6 ? "Option A" : "Option B",
      isCorrect: idx < 6,
    })),
  });

  // Charlie on Designer test (no threshold set => considered passed if result exists)
  const resultCharlieDesigner = await prisma.preselectionResult.create({
    data: { userId: charlie.id, testId: testDesignerNoThreshold.id, score: 12 },
  });
  const questionsDesigner = await prisma.preselectionQuestion.findMany({ where: { testId: testDesignerNoThreshold.id } });
  await prisma.applicantAnswer.createMany({
    data: questionsDesigner.map((q, idx) => ({
      resultId: resultCharlieDesigner.id,
      questionId: q.id,
      selected: idx < 12 ? "Option A" : "Option B",
      isCorrect: idx < 12,
    })),
  });

  // Developer applies to Frontend job without expected salary (no preselection submitted)
  await prisma.application.create({
    data: {
      userId: devUser.id,
      jobId: jobFrontend.id,
      cvFile: "uploads/dev_cv.pdf",
      expectedSalary: null,
      status: ApplicationStatus.SUBMITTED,
    },
  });

  // Dev saves a job
  await prisma.savedJob.create({
    data: { userId: devUser.id, jobId: jobFrontend.id },
  });

  console.log("✅ Comprehensive seeding completed successfully!");
  console.log("📊 Generated data summary:");
  console.log(`👥 Users: 6 (1 admin, 5 users)`);
  console.log(`🏢 Companies: 5`);
  console.log(`💼 Jobs: 8`);
  console.log(`📝 Applications: 8`);
  console.log(`🎯 Interviews: 5`);
  console.log(`📋 Preselection Tests: 6`);
  console.log(`🧠 Skill Assessments: 4`);
  console.log(`🏆 Badge Templates: 4`);
  console.log(`🎖️ User Badges: 6`);
  console.log(`📄 Generated CVs: 5`);
  console.log(`💳 Subscriptions: 5`);
  console.log(`💰 Payments: 5`);
  console.log(`💼 Employment Records: 4`);
  console.log(`⭐ Company Reviews: 4`);
  console.log(`💾 Saved Jobs: 8`);
  console.log(`📤 Job Shares: 6`);
  console.log(`🔗 User Providers: 4`);

  // Additional summary (extended scenarios and credentials)
  console.log("\n✅ Extended scenarios added:");
  console.log("- Inactive preselection (Marketing), No-threshold preselection (Designer)");
  console.log("- Multi-round interviews, Freelance employment, Multi-subscriptions");
  console.log("- Plans: only STANDARD and PROFESSIONAL; Developer role user");

  console.log("\n📊 Updated approximate totals after extension:");
  console.log("Users ≈ 8, Applications ≈ 9, Interviews ≈ 6, Preselection Tests ≈ 8,");
  console.log("Generated CVs ≈ 6, Subscriptions ≈ 7, Payments ≈ 7, Employment ≈ 5,");
  console.log("Reviews ≈ 5, Saved Jobs ≈ 9, Job Shares ≈ 7, Providers ≈ 5");

  console.log("\nDemo credentials:");
  console.log("Admin (global): admin@company.com / admin123");
  console.log("Company Admins: admin@techcorp.id, admin@techstars.id, admin@indie.co, admin@fintechcorp.com, admin@creativestudio.id (password: admin123)");
  console.log("PROFESSIONAL subscriber: gina.gold@example.com / gold12345");
  console.log("PROFESSIONAL subscriber (active): alice@example.com / user12345");
  console.log("STANDARD subscriber (pending): bob@example.com / user12345");
  console.log("PROFESSIONAL subscriber: eko@example.com / user12345");
  console.log("PROFESSIONAL (expired): diana@example.com / user12345");
  console.log("Developer role: workoo.dev@gmail.com / work00dev");

  // Clean summary reflecting current dataset and 2 plans
  console.log("\n=== Summary ===");
  console.log("Users: 13 (1 global admin, 5 company admins, 6 users, 1 developer)");
  console.log("Companies: 5");
  console.log("Jobs: 8");
  console.log("Applications: 9");
  console.log("Interviews: 6");
  console.log("Preselection Tests: 8 (incl. 1 inactive, 1 without threshold)");
  console.log("Skill Assessments: 4");
  console.log("Badge Templates: 4");
  console.log("User Badges: 6");
  console.log("Generated CVs: 6");
  console.log("Subscriptions: 7");
  console.log("Payments: 7");
  console.log("Employment Records: 5");
  console.log("Company Reviews: 5");
  console.log("Saved Jobs: 9");
  console.log("Job Shares: 7");
  console.log("User Providers: 5");
  console.log("Plans: STANDARD, PROFESSIONAL");
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });






