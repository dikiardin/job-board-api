import {
  Prisma,
  PrismaClient,
  PreselectionTest,
  Job,
  Company,
} from "../../generated/prisma";
import { SeedUsersResult } from "./users";
import { buildMCQ } from "./questionUtils";

interface SeedCompaniesOptions {
  prisma: PrismaClient;
  now: Date;
  addDays: (days: number) => Date;
  users: SeedUsersResult;
}

type AdminKey = keyof SeedUsersResult["admins"];

const companySeeds = [
  { key: "techCorp" as const, ownerKey: "tech" as AdminKey, name: "TechCorp Indonesia", description: "Enterprise technology provider focusing on cloud-native solutions.", logoUrl: "https://placehold.co/120x120?text=TechCorp", bannerUrl: "https://placehold.co/1200x400?text=TechCorp", website: "https://techcorp.id", locationCity: "Jakarta", locationProvince: "DKI Jakarta", address: "Jl. Gatot Subroto No. 1, Jakarta", socials: { linkedin: "https://linkedin.com/company/techcorp", instagram: "https://instagram.com/techcorp" } as Prisma.JsonObject },
  { key: "creativeStudio" as const, ownerKey: "creative" as AdminKey, name: "Creative Studio", description: "Design agency delivering delightful user experiences.", logoUrl: "https://placehold.co/120x120?text=Creative", bannerUrl: "https://placehold.co/1200x400?text=Creative", website: "https://creativestudio.id", locationCity: "Bandung", locationProvince: "Jawa Barat", address: "Jl. Riau No. 5, Bandung", socials: { dribbble: "https://dribbble.com/creativestudio", instagram: "https://instagram.com/creativestudio" } as Prisma.JsonObject },
  { key: "fintechLabs" as const, ownerKey: "fintech" as AdminKey, name: "Fintech Labs", description: "Digital financial services powering SMEs.", logoUrl: "https://placehold.co/120x120?text=Fintech", bannerUrl: "https://placehold.co/1200x400?text=Fintech", website: "https://fintechlabs.id", locationCity: "Surabaya", locationProvince: "Jawa Timur", address: "Jl. Tunjungan No. 20, Surabaya", socials: { linkedin: "https://linkedin.com/company/fintechlabs", twitter: "https://twitter.com/fintechlabs" } as Prisma.JsonObject },
] as const;

const jobSeeds = [
  { key: "frontend" as const, companyKey: "techCorp" as const, title: "Senior Frontend Engineer", description: "Lead the frontend guild to build accessible, performant experiences.", category: "Engineering", employmentType: "Full-time", experienceLevel: "Senior", city: "Jakarta", province: "DKI Jakarta", salaryMin: 25_000_000, salaryMax: 35_000_000, tags: ["react", "typescript", "ui"], bannerUrl: "https://placehold.co/960x360?text=Frontend", applyDeadlineOffsetDays: 30, isPublished: true },
  { key: "dataScientist" as const, companyKey: "techCorp" as const, title: "Data Scientist", description: "Collaborate with product teams to build predictive analytics.", category: "Data", employmentType: "Full-time", experienceLevel: "Mid", city: "Jakarta", province: "DKI Jakarta", salaryMin: 20_000_000, salaryMax: 28_000_000, tags: ["python", "machine-learning", "sql"], bannerUrl: "https://placehold.co/960x360?text=Data+Scientist", applyDeadlineOffsetDays: 15, isPublished: true },
  { key: "uxDesigner" as const, companyKey: "creativeStudio" as const, title: "UX Designer", description: "Design end-to-end journeys for regional clients.", category: "Design", employmentType: "Contract", experienceLevel: "Intermediate", city: "Bandung", province: "Jawa Barat", salaryMin: 12_000_000, salaryMax: 18_000_000, tags: ["ux", "research", "figma"], bannerUrl: "https://placehold.co/960x360?text=UX+Designer", applyDeadlineOffsetDays: 21, isPublished: true },
  { key: "productManager" as const, companyKey: "fintechLabs" as const, title: "Product Manager", description: "Own lending product roadmap and ship impactful features.", category: "Product", employmentType: "Full-time", experienceLevel: "Senior", city: "Surabaya", province: "Jawa Timur", salaryMin: 28_000_000, salaryMax: 36_000_000, tags: ["product", "strategy", "agile"], bannerUrl: "https://placehold.co/960x360?text=Product+Manager", applyDeadlineOffsetDays: 30, isPublished: true },
  { key: "marketingSpecialist" as const, companyKey: "creativeStudio" as const, title: "Marketing Specialist", description: "Plan omni-channel campaigns to grow client brands across Indonesia.", category: "Marketing", employmentType: "Full-time", experienceLevel: "Mid", city: "Bandung", province: "Jawa Barat", salaryMin: 10_000_000, salaryMax: 16_000_000, tags: ["seo", "content", "analytics"], bannerUrl: "https://placehold.co/960x360?text=Marketing", applyDeadlineOffsetDays: 18, isPublished: true },
  { key: "customerSuccess" as const, companyKey: "techCorp" as const, title: "Customer Success Lead", description: "Coach a distributed CS team supporting enterprise cloud customers.", category: "Operations", employmentType: "Hybrid", experienceLevel: "Senior", city: "Medan", province: "Sumatera Utara", salaryMin: 18_000_000, salaryMax: 24_000_000, tags: ["saas", "customer-success", "leadership"], bannerUrl: "https://placehold.co/960x360?text=Customer+Success", applyDeadlineOffsetDays: null, isPublished: false },
] as const;

const testSeeds = [
  { key: "frontend" as const, jobKey: "frontend" as const, prefix: "Frontend", passingScore: 18, answer: "A" },
  { key: "dataScientist" as const, jobKey: "dataScientist" as const, prefix: "Data", passingScore: 17, answer: "B" },
] as const;

type CompanySeed = (typeof companySeeds)[number];
type CompanyKey = CompanySeed["key"];

type JobSeed = (typeof jobSeeds)[number];
type JobKey = JobSeed["key"];

type TestSeed = (typeof testSeeds)[number];
type TestKey = TestSeed["key"];

export type SeedCompaniesResult = {
  companies: Record<CompanyKey, Company>;
  jobs: Record<JobKey, Job>;
  tests: Record<TestKey, PreselectionTest>;
};

export async function seedCompaniesAndJobs({
  prisma,
  now,
  addDays,
  users,
}: SeedCompaniesOptions): Promise<SeedCompaniesResult> {
  const companyEntries = await Promise.all(
    companySeeds.map(async (seed) => {
      const company = await prisma.company.create({
        data: {
          ownerAdminId: seed.ownerKey ? users.admins[seed.ownerKey].id : null,
          name: seed.name,
          description: seed.description,
          logoUrl: seed.logoUrl,
          bannerUrl: seed.bannerUrl,
          website: seed.website,
          locationCity: seed.locationCity,
          locationProvince: seed.locationProvince,
          address: seed.address,
          socials: seed.socials,
        },
      });
      return [seed.key, company] as const;
    })
  );

  const companies = Object.fromEntries(companyEntries) as Record<CompanyKey, Company>;

  const jobEntries = await Promise.all(
    jobSeeds.map(async (seed) => {
      const applyDeadline =
        seed.applyDeadlineOffsetDays !== null && seed.applyDeadlineOffsetDays !== undefined
          ? addDays(seed.applyDeadlineOffsetDays)
          : null;

      const job = await prisma.job.create({
        data: {
          companyId: companies[seed.companyKey].id,
          title: seed.title,
          description: seed.description,
          category: seed.category,
          employmentType: seed.employmentType,
          experienceLevel: seed.experienceLevel,
          city: seed.city,
          province: seed.province,
          salaryMin: seed.salaryMin,
          salaryMax: seed.salaryMax,
          tags: [...seed.tags],
          bannerUrl: seed.bannerUrl,
          applyDeadline,
          isPublished: seed.isPublished,
          publishedAt: seed.isPublished ? now : null,
        },
      });
      return [seed.key, job] as const;
    })
  );

  const jobs = Object.fromEntries(jobEntries) as Record<JobKey, Job>;

  const testEntries = await Promise.all(
    testSeeds.map(async (seed) => {
      const test = await prisma.preselectionTest.create({
        data: {
          jobId: jobs[seed.jobKey].id,
          passingScore: seed.passingScore,
          questions: { create: buildMCQ(seed.prefix, 25, seed.answer) },
        },
      });
      return [seed.key, test] as const;
    })
  );

  const tests = Object.fromEntries(testEntries) as Record<TestKey, PreselectionTest>;

  return { companies, jobs, tests };
}

