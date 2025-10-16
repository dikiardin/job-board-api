"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedEmploymentAndReviews = seedEmploymentAndReviews;
const prisma_1 = require("../../generated/prisma");
async function seedEmploymentAndReviews({ prisma, now, users, companies, }) {
    const { seekers, admins } = users;
    const { companies: { techCorp, creativeStudio, fintechLabs }, } = companies;
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
    // Update existing Gina employment to current position (UX Designer from accepted application)
    const employmentGinaUpdated = await prisma.employment.update({
        where: {
            userId_companyId: {
                userId: seekers.gina.id,
                companyId: creativeStudio.id,
            },
        },
        data: {
            positionTitle: "UX Designer", // Updated from Product Designer
            isCurrent: true, // Now current employee
            isVerified: true,
            verifiedAt: now,
            verifiedById: admins.creative.id,
        },
    });
    // NEW: Employment record for Eko based on ACCEPTED application (for testing new company review logic)
    const employmentEko = await prisma.employment.create({
        data: {
            userId: seekers.eko.id,
            companyId: techCorp.id,
            positionTitle: "Customer Success Lead",
            department: "Operations",
            startDate: now,
            isCurrent: true,
            isVerified: true,
            verifiedAt: now,
            verifiedById: admins.tech.id,
            companyNameSnapshot: techCorp.name,
            userNameSnapshot: seekers.eko.name ?? "Eko Prasetyo",
        },
    });
    // NEW: Employment records for additional reviewers
    const employmentCharlieTech = await prisma.employment.create({
        data: {
            userId: seekers.charlie.id,
            companyId: techCorp.id,
            positionTitle: "Backend Engineer",
            department: "Engineering",
            startDate: new Date("2023-01-01"),
            endDate: new Date("2024-06-30"),
            isCurrent: false,
            isVerified: true,
            verifiedAt: now,
            verifiedById: admins.tech.id,
            companyNameSnapshot: techCorp.name,
            userNameSnapshot: seekers.charlie.name ?? "Charlie Wijaya",
        },
    });
    const employmentDianaTech = await prisma.employment.create({
        data: {
            userId: seekers.diana.id,
            companyId: techCorp.id,
            positionTitle: "DevOps Engineer",
            department: "Engineering",
            startDate: new Date("2023-06-01"),
            isCurrent: true,
            isVerified: true,
            verifiedAt: now,
            verifiedById: admins.tech.id,
            companyNameSnapshot: techCorp.name,
            userNameSnapshot: seekers.diana.name ?? "Diana Sari",
        },
    });
    const employmentCharlieCreative = await prisma.employment.create({
        data: {
            userId: seekers.charlie.id,
            companyId: creativeStudio.id,
            positionTitle: "Graphic Designer",
            department: "Design",
            startDate: new Date("2024-01-01"),
            isCurrent: true,
            isVerified: true,
            verifiedAt: now,
            verifiedById: admins.creative.id,
            companyNameSnapshot: creativeStudio.name,
            userNameSnapshot: seekers.charlie.name ?? "Charlie Wijaya",
        },
    });
    const employmentDianaCreative = await prisma.employment.create({
        data: {
            userId: seekers.diana.id,
            companyId: creativeStudio.id,
            positionTitle: "Brand Strategist",
            department: "Marketing",
            startDate: new Date("2023-03-01"),
            endDate: new Date("2024-02-28"),
            isCurrent: false,
            isVerified: true,
            verifiedAt: now,
            verifiedById: admins.creative.id,
            companyNameSnapshot: creativeStudio.name,
            userNameSnapshot: seekers.diana.name ?? "Diana Sari",
        },
    });
    const employmentAliceFintech = await prisma.employment.create({
        data: {
            userId: seekers.alice.id,
            companyId: fintechLabs.id,
            positionTitle: "Product Manager",
            department: "Product",
            startDate: new Date("2023-09-01"),
            isCurrent: true,
            isVerified: true,
            verifiedAt: now,
            verifiedById: admins.fintech.id,
            companyNameSnapshot: fintechLabs.name,
            userNameSnapshot: seekers.alice.name ?? "Alice Hartono",
        },
    });
    const employmentGinaFintech = await prisma.employment.create({
        data: {
            userId: seekers.gina.id,
            companyId: fintechLabs.id,
            positionTitle: "Data Analyst",
            department: "Data",
            startDate: new Date("2024-02-01"),
            isCurrent: true,
            isVerified: true,
            verifiedAt: now,
            verifiedById: admins.fintech.id,
            companyNameSnapshot: fintechLabs.name,
            userNameSnapshot: seekers.gina.name ?? "Gina Gold",
        },
    });
    // NEW: Additional employment records for more review diversity
    const employmentBobTech = await prisma.employment.create({
        data: {
            userId: seekers.bob.id,
            companyId: techCorp.id,
            positionTitle: "Senior Data Analyst",
            department: "Data",
            startDate: new Date("2024-07-01"),
            isCurrent: true,
            isVerified: true,
            verifiedAt: now,
            verifiedById: admins.tech.id,
            companyNameSnapshot: techCorp.name,
            userNameSnapshot: seekers.bob.name ?? "Bob Pratama",
        },
    });
    const employmentEkoCreative = await prisma.employment.create({
        data: {
            userId: seekers.eko.id,
            companyId: creativeStudio.id,
            positionTitle: "Project Manager",
            department: "Operations",
            startDate: new Date("2023-08-01"),
            endDate: new Date("2024-05-31"),
            isCurrent: false,
            isVerified: true,
            verifiedAt: now,
            verifiedById: admins.creative.id,
            companyNameSnapshot: creativeStudio.name,
            userNameSnapshot: seekers.eko.name ?? "Eko Prasetyo",
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
                ratingCulture: new prisma_1.Prisma.Decimal("4.50"),
                ratingFacilities: new prisma_1.Prisma.Decimal("4.20"),
                ratingWorkLife: new prisma_1.Prisma.Decimal("4.00"),
                ratingCareer: new prisma_1.Prisma.Decimal("4.30"),
                salaryEstimateMin: 25000000,
                salaryEstimateMax: 33000000,
                body: "Strong engineering culture with focus on accessibility and performance.",
            },
            {
                companyId: fintechLabs.id,
                employmentId: employmentBob.id,
                reviewerUserId: seekers.bob.id,
                positionTitle: "Business Analyst",
                isVerifiedEmployee: true,
                ratingCulture: new prisma_1.Prisma.Decimal("4.10"),
                ratingFacilities: new prisma_1.Prisma.Decimal("3.90"),
                ratingWorkLife: new prisma_1.Prisma.Decimal("3.80"),
                ratingCareer: new prisma_1.Prisma.Decimal("4.00"),
                salaryEstimateMin: 18000000,
                salaryEstimateMax: 22000000,
                body: "Fast-paced environment with strong data-driven culture.",
            },
            // Company review for Gina (UX Designer) - using updated employment record
            {
                companyId: creativeStudio.id,
                employmentId: employmentGina.id, // Using existing employment record
                reviewerUserId: seekers.gina.id,
                positionTitle: "UX Designer",
                isVerifiedEmployee: true,
                isAnonymous: true,
                ratingCulture: new prisma_1.Prisma.Decimal("4.80"),
                ratingFacilities: new prisma_1.Prisma.Decimal("4.50"),
                ratingWorkLife: new prisma_1.Prisma.Decimal("4.70"),
                ratingCareer: new prisma_1.Prisma.Decimal("4.60"),
                salaryEstimateMin: 16000000,
                salaryEstimateMax: 18000000,
                body: "Excellent work environment after being accepted through the application process. Great team collaboration and modern design tools.",
                reviewerSnapshot: "Anonymous",
            },
            // NEW: Company review for Eko - using employment record
            {
                companyId: techCorp.id,
                employmentId: employmentEko.id, // Using employment record
                reviewerUserId: seekers.eko.id,
                positionTitle: "Customer Success Lead",
                isVerifiedEmployee: true,
                isAnonymous: true, // Make anonymous for consistency
                ratingCulture: new prisma_1.Prisma.Decimal("4.70"),
                ratingFacilities: new prisma_1.Prisma.Decimal("4.40"),
                ratingWorkLife: new prisma_1.Prisma.Decimal("4.50"),
                ratingCareer: new prisma_1.Prisma.Decimal("4.80"),
                salaryEstimateMin: 20000000,
                salaryEstimateMax: 24000000,
                body: "Outstanding leadership opportunities and supportive management. The company truly values customer success and provides excellent growth paths.",
                reviewerSnapshot: "Anonymous",
            },
            // ADDITIONAL REVIEWS FOR TECHCORP (for better rating testing)
            {
                companyId: techCorp.id,
                employmentId: employmentCharlieTech.id, // Using Charlie's TechCorp employment
                reviewerUserId: seekers.charlie.id,
                positionTitle: "Backend Engineer",
                isVerifiedEmployee: true,
                isAnonymous: true,
                ratingCulture: new prisma_1.Prisma.Decimal("4.20"),
                ratingFacilities: new prisma_1.Prisma.Decimal("4.00"),
                ratingWorkLife: new prisma_1.Prisma.Decimal("3.80"),
                ratingCareer: new prisma_1.Prisma.Decimal("4.40"),
                salaryEstimateMin: 28000000,
                salaryEstimateMax: 35000000,
                body: "Good technical environment but work-life balance could be improved. Lots of learning opportunities.",
                reviewerSnapshot: "Anonymous",
            },
            {
                companyId: techCorp.id,
                employmentId: employmentDianaTech.id, // Using Diana's TechCorp employment
                reviewerUserId: seekers.diana.id,
                positionTitle: "DevOps Engineer",
                isVerifiedEmployee: true,
                isAnonymous: true, // Make anonymous for consistency
                ratingCulture: new prisma_1.Prisma.Decimal("4.90"),
                ratingFacilities: new prisma_1.Prisma.Decimal("4.70"),
                ratingWorkLife: new prisma_1.Prisma.Decimal("4.60"),
                ratingCareer: new prisma_1.Prisma.Decimal("4.50"),
                salaryEstimateMin: 32000000,
                salaryEstimateMax: 40000000,
                body: "Amazing company culture! Very supportive team and excellent infrastructure. Highly recommend for tech professionals.",
                reviewerSnapshot: "Anonymous",
            },
            // ADDITIONAL REVIEWS FOR CREATIVE STUDIO (for better rating testing)
            {
                companyId: creativeStudio.id,
                employmentId: employmentCharlieCreative.id, // Using Charlie's Creative Studio employment
                reviewerUserId: seekers.charlie.id,
                positionTitle: "Graphic Designer",
                isVerifiedEmployee: true,
                isAnonymous: true, // Make anonymous for consistency
                ratingCulture: new prisma_1.Prisma.Decimal("4.60"),
                ratingFacilities: new prisma_1.Prisma.Decimal("4.30"),
                ratingWorkLife: new prisma_1.Prisma.Decimal("4.40"),
                ratingCareer: new prisma_1.Prisma.Decimal("4.20"),
                salaryEstimateMin: 12000000,
                salaryEstimateMax: 16000000,
                body: "Creative freedom is excellent here. Great for building portfolio and learning new design trends.",
                reviewerSnapshot: "Anonymous",
            },
            {
                companyId: creativeStudio.id,
                employmentId: employmentDianaCreative.id, // Using Diana's Creative Studio employment
                reviewerUserId: seekers.diana.id,
                positionTitle: "Brand Strategist",
                isVerifiedEmployee: true,
                isAnonymous: true,
                ratingCulture: new prisma_1.Prisma.Decimal("4.10"),
                ratingFacilities: new prisma_1.Prisma.Decimal("3.90"),
                ratingWorkLife: new prisma_1.Prisma.Decimal("4.00"),
                ratingCareer: new prisma_1.Prisma.Decimal("3.80"),
                salaryEstimateMin: 15000000,
                salaryEstimateMax: 20000000,
                body: "Good place to start career in branding. However, can be quite demanding during peak seasons.",
                reviewerSnapshot: "Anonymous",
            },
            // ADDITIONAL REVIEWS FOR FINTECH LABS (for comprehensive testing)
            {
                companyId: fintechLabs.id,
                employmentId: employmentAliceFintech.id, // Using Alice's Fintech employment
                reviewerUserId: seekers.alice.id,
                positionTitle: "Product Manager",
                isVerifiedEmployee: true,
                isAnonymous: true, // Make anonymous for consistency
                ratingCulture: new prisma_1.Prisma.Decimal("4.30"),
                ratingFacilities: new prisma_1.Prisma.Decimal("4.10"),
                ratingWorkLife: new prisma_1.Prisma.Decimal("3.90"),
                ratingCareer: new prisma_1.Prisma.Decimal("4.60"),
                salaryEstimateMin: 35000000,
                salaryEstimateMax: 45000000,
                body: "Fast-paced fintech environment with great career growth. Perfect for those who love challenges.",
                reviewerSnapshot: "Anonymous",
            },
            {
                companyId: fintechLabs.id,
                employmentId: employmentGinaFintech.id, // Using Gina's Fintech employment
                reviewerUserId: seekers.gina.id,
                positionTitle: "Data Analyst",
                isVerifiedEmployee: true,
                isAnonymous: true,
                ratingCulture: new prisma_1.Prisma.Decimal("4.00"),
                ratingFacilities: new prisma_1.Prisma.Decimal("3.80"),
                ratingWorkLife: new prisma_1.Prisma.Decimal("3.70"),
                ratingCareer: new prisma_1.Prisma.Decimal("4.20"),
                salaryEstimateMin: 22000000,
                salaryEstimateMax: 28000000,
                body: "Data-driven culture with lots of analytical challenges. Work can be intense but rewarding.",
                reviewerSnapshot: "Anonymous",
            },
            // NEW: Additional reviews from new employment records
            {
                companyId: techCorp.id,
                employmentId: employmentBobTech.id, // Using Bob's new TechCorp employment
                reviewerUserId: seekers.bob.id,
                positionTitle: "Senior Data Analyst",
                isVerifiedEmployee: true,
                isAnonymous: false, // Not anonymous to show variety
                ratingCulture: new prisma_1.Prisma.Decimal("4.60"),
                ratingFacilities: new prisma_1.Prisma.Decimal("4.50"),
                ratingWorkLife: new prisma_1.Prisma.Decimal("4.20"),
                ratingCareer: new prisma_1.Prisma.Decimal("4.70"),
                salaryEstimateMin: 30000000,
                salaryEstimateMax: 38000000,
                body: "Excellent data infrastructure and analytics tools. Great team collaboration and learning opportunities in AI/ML.",
                reviewerSnapshot: seekers.bob.name ?? "Bob Pratama",
            },
            {
                companyId: creativeStudio.id,
                employmentId: employmentEkoCreative.id, // Using Eko's Creative Studio employment
                reviewerUserId: seekers.eko.id,
                positionTitle: "Project Manager",
                isVerifiedEmployee: true,
                isAnonymous: false, // Not anonymous to show variety
                ratingCulture: new prisma_1.Prisma.Decimal("4.40"),
                ratingFacilities: new prisma_1.Prisma.Decimal("4.10"),
                ratingWorkLife: new prisma_1.Prisma.Decimal("4.30"),
                ratingCareer: new prisma_1.Prisma.Decimal("4.00"),
                salaryEstimateMin: 18000000,
                salaryEstimateMax: 23000000,
                body: "Great place for creative project management. Flexible work arrangements and supportive creative teams.",
                reviewerSnapshot: seekers.eko.name ?? "Eko Prasetyo",
            },
        ],
    });
}
