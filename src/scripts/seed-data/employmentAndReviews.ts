import { Prisma, PrismaClient } from "../../generated/prisma";
import { SeedUsersResult } from "./users";
import { SeedCompaniesResult } from "./companies";

interface SeedEmploymentOptions {
  prisma: PrismaClient;
  now: Date;
  users: SeedUsersResult;
  companies: SeedCompaniesResult;
}

export async function seedEmploymentAndReviews({
  prisma,
  now,
  users,
  companies,
}: SeedEmploymentOptions) {
  const { seekers, admins } = users;
  const {
    companies: { techCorp, creativeStudio, fintechLabs },
  } = companies;

  const employmentAlice = await prisma.employment.create({
    data: {
      userId: seekers.alice.id,
      companyId: techCorp.id,
      positionTitle: "Frontend Engineer",
      department: "Engineering",
      startDate: new Date("2020-01-01"),
      isCurrent: true,
      isVerified: true,
      verifiedAt: now,
      verifiedById: admins.tech.id,
      companyNameSnapshot: techCorp.name,
      userNameSnapshot: seekers.alice.name ?? "Alice Hartono",
    },
  });

  const employmentBob = await prisma.employment.create({
    data: {
      userId: seekers.bob.id,
      companyId: fintechLabs.id,
      positionTitle: "Business Analyst",
      department: "Data",
      startDate: new Date("2018-03-01"),
      endDate: new Date("2021-05-31"),
      isCurrent: false,
      isVerified: true,
      verifiedAt: now,
      verifiedById: admins.fintech.id,
      companyNameSnapshot: fintechLabs.name,
      userNameSnapshot: seekers.bob.name ?? "Bob Pratama",
    },
  });

  const employmentGina = await prisma.employment.create({
    data: {
      userId: seekers.gina.id,
      companyId: creativeStudio.id,
      positionTitle: "Product Designer",
      department: "Design",
      startDate: new Date("2019-04-01"),
      endDate: new Date("2022-12-31"),
      isCurrent: false,
      isVerified: false,
      companyNameSnapshot: creativeStudio.name,
      userNameSnapshot: seekers.gina.name ?? "Gina Gold",
    },
  });

  await prisma.companyReview.createMany({
    data: [
      {
        companyId: techCorp.id,
        employmentId: employmentAlice.id,
        reviewerUserId: seekers.alice.id,
        positionTitle: "Senior Frontend Engineer",
        isVerifiedEmployee: true,
        ratingCulture: new Prisma.Decimal("4.50"),
        ratingFacilities: new Prisma.Decimal("4.20"),
        ratingWorkLife: new Prisma.Decimal("4.00"),
        ratingCareer: new Prisma.Decimal("4.30"),
        salaryEstimateMin: 25_000_000,
        salaryEstimateMax: 33_000_000,
        body: "Strong engineering culture with focus on accessibility and performance.",
      },
      {
        companyId: fintechLabs.id,
        employmentId: employmentBob.id,
        reviewerUserId: seekers.bob.id,
        positionTitle: "Business Analyst",
        isVerifiedEmployee: true,
        ratingCulture: new Prisma.Decimal("4.10"),
        ratingFacilities: new Prisma.Decimal("3.90"),
        ratingWorkLife: new Prisma.Decimal("3.80"),
        ratingCareer: new Prisma.Decimal("4.00"),
        salaryEstimateMin: 18_000_000,
        salaryEstimateMax: 22_000_000,
        body: "Fast-paced environment with strong data-driven culture.",
      },
      {
        companyId: creativeStudio.id,
        employmentId: employmentGina.id,
        reviewerUserId: seekers.gina.id,
        positionTitle: "Product Designer",
        isVerifiedEmployee: false,
        ratingCulture: new Prisma.Decimal("4.00"),
        ratingFacilities: new Prisma.Decimal("3.80"),
        ratingWorkLife: new Prisma.Decimal("4.20"),
        ratingCareer: new Prisma.Decimal("3.90"),
        salaryEstimateMin: 15_000_000,
        salaryEstimateMax: 19_000_000,
        body: "Great mentorship but projects can be fast-paced during peak season.",
      },
    ],
  });
}

