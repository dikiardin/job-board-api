"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedCompaniesAndJobs = seedCompaniesAndJobs;
const questionUtils_1 = require("./questionUtils");
const companySeeds = [
    { key: "techCorp", ownerKey: "tech", name: "TechCorp Indonesia", email: "contact@techcorp.id", description: "Enterprise technology provider focusing on cloud-native solutions.", logoUrl: "https://placehold.co/120x120?text=TechCorp", bannerUrl: "https://placehold.co/1200x400?text=TechCorp", website: "https://techcorp.id", locationCity: "Jakarta", locationProvince: "DKI Jakarta", address: "Jl. Gatot Subroto No. 1, Jakarta", socials: { linkedin: "https://linkedin.com/company/techcorp", instagram: "https://instagram.com/techcorp" } },
    { key: "creativeStudio", ownerKey: "creative", name: "Creative Studio", email: "hello@creativestudio.id", description: "Design agency delivering delightful user experiences.", logoUrl: "https://placehold.co/120x120?text=Creative", bannerUrl: "https://placehold.co/1200x400?text=Creative", website: "https://creativestudio.id", locationCity: "Bandung", locationProvince: "Jawa Barat", address: "Jl. Riau No. 5, Bandung", socials: { dribbble: "https://dribbble.com/creativestudio", instagram: "https://instagram.com/creativestudio" } },
    { key: "fintechLabs", ownerKey: "fintech", name: "Fintech Labs", email: "info@fintechlabs.id", description: "Digital financial services powering SMEs.", logoUrl: "https://placehold.co/120x120?text=Fintech", bannerUrl: "https://placehold.co/1200x400?text=Fintech", website: "https://fintechlabs.id", locationCity: "Surabaya", locationProvince: "Jawa Timur", address: "Jl. Tunjungan No. 20, Surabaya", socials: { linkedin: "https://linkedin.com/company/fintechlabs", twitter: "https://twitter.com/fintechlabs" } },
];
const jobSeeds = [
    { key: "frontend", companyKey: "techCorp", title: "Senior Frontend Engineer", description: "Lead the frontend guild to build accessible, performant experiences.", category: "Engineering", employmentType: "Full-time", experienceLevel: "Senior", city: "Jakarta", province: "DKI Jakarta", salaryMin: 25000000, salaryMax: 35000000, tags: ["react", "typescript", "ui"], bannerUrl: "https://placehold.co/960x360?text=Frontend", applyDeadlineOffsetDays: 30, isPublished: true },
    { key: "dataScientist", companyKey: "techCorp", title: "Data Scientist", description: "Collaborate with product teams to build predictive analytics.", category: "Data", employmentType: "Full-time", experienceLevel: "Mid", city: "Jakarta", province: "DKI Jakarta", salaryMin: 20000000, salaryMax: 28000000, tags: ["python", "machine-learning", "sql"], bannerUrl: "https://placehold.co/960x360?text=Data+Scientist", applyDeadlineOffsetDays: 15, isPublished: true },
    { key: "uxDesigner", companyKey: "creativeStudio", title: "UX Designer", description: "Design end-to-end journeys for regional clients.", category: "Design", employmentType: "Contract", experienceLevel: "Intermediate", city: "Bandung", province: "Jawa Barat", salaryMin: 12000000, salaryMax: 18000000, tags: ["ux", "research", "figma"], bannerUrl: "https://placehold.co/960x360?text=UX+Designer", applyDeadlineOffsetDays: 21, isPublished: true },
    { key: "productManager", companyKey: "fintechLabs", title: "Product Manager", description: "Own lending product roadmap and ship impactful features.", category: "Product", employmentType: "Full-time", experienceLevel: "Senior", city: "Surabaya", province: "Jawa Timur", salaryMin: 28000000, salaryMax: 36000000, tags: ["product", "strategy", "agile"], bannerUrl: "https://placehold.co/960x360?text=Product+Manager", applyDeadlineOffsetDays: 30, isPublished: true },
    { key: "marketingSpecialist", companyKey: "creativeStudio", title: "Marketing Specialist", description: "Plan omni-channel campaigns to grow client brands across Indonesia.", category: "Marketing", employmentType: "Full-time", experienceLevel: "Mid", city: "Bandung", province: "Jawa Barat", salaryMin: 10000000, salaryMax: 16000000, tags: ["seo", "content", "analytics"], bannerUrl: "https://placehold.co/960x360?text=Marketing", applyDeadlineOffsetDays: 18, isPublished: true },
    { key: "customerSuccess", companyKey: "techCorp", title: "Customer Success Lead", description: "Coach a distributed CS team supporting enterprise cloud customers.", category: "Operations", employmentType: "Hybrid", experienceLevel: "Senior", city: "Medan", province: "Sumatera Utara", salaryMin: 18000000, salaryMax: 24000000, tags: ["saas", "customer-success", "leadership"], bannerUrl: "https://placehold.co/960x360?text=Customer+Success", applyDeadlineOffsetDays: null, isPublished: false },
];
const testSeeds = [
    { key: "frontend", jobKey: "frontend", prefix: "Frontend", passingScore: 18, answer: "A" },
    { key: "dataScientist", jobKey: "dataScientist", prefix: "Data", passingScore: 17, answer: "B" },
];
async function seedCompaniesAndJobs({ prisma, now, addDays, users, }) {
    const companyEntries = await Promise.all(companySeeds.map(async (seed) => {
        const company = await prisma.company.create({
            data: {
                ownerAdminId: seed.ownerKey ? users.admins[seed.ownerKey].id : null,
                name: seed.name,
                email: seed.email,
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
        return [seed.key, company];
    }));
    const companies = Object.fromEntries(companyEntries);
    const jobEntries = await Promise.all(jobSeeds.map(async (seed) => {
        const applyDeadline = seed.applyDeadlineOffsetDays !== null && seed.applyDeadlineOffsetDays !== undefined
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
        return [seed.key, job];
    }));
    const jobs = Object.fromEntries(jobEntries);
    const testEntries = await Promise.all(testSeeds.map(async (seed) => {
        const test = await prisma.preselectionTest.create({
            data: {
                jobId: jobs[seed.jobKey].id,
                passingScore: seed.passingScore,
                questions: { create: (0, questionUtils_1.buildMCQ)(seed.prefix, 25, seed.answer) },
            },
        });
        return [seed.key, test];
    }));
    const tests = Object.fromEntries(testEntries);
    return { companies, jobs, tests };
}
//# sourceMappingURL=companies.js.map