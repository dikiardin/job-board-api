"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedApplications = seedApplications;
const prisma_1 = require("../../generated/prisma");
const questionUtils_1 = require("./questionUtils");
async function seedApplications({ prisma, now, addDays, users, companies, }) {
    const { seekers, admins, developer } = users;
    const { jobs, tests } = companies;
    const { alice, bob, gina, charlie, diana, eko, testProfessional, testStandard } = seekers;
    const hourMs = 60 * 60 * 1000;
    const applicationSeeds = [
        {
            key: "aliceFrontend",
            data: { userId: alice.id, jobId: jobs.frontend.id, cvUrl: "https://res.cloudinary.com/demo/cv/alice-frontend.pdf", cvFileName: "alice-frontend.pdf", cvFileSize: 185000, expectedSalary: 32000000, expectedSalaryCurrency: "IDR", status: prisma_1.ApplicationStatus.INTERVIEW, reviewNote: "Strong portfolio, proceed to interview", reviewUpdatedAt: now, referralSource: "LinkedIn" },
            attachments: [{ url: "https://res.cloudinary.com/demo/alice/portfolio.pdf", fileName: "portfolio.pdf", fileSize: 320000 }],
            timeline: [
                { status: prisma_1.ApplicationStatus.SUBMITTED, note: "Application submitted via job board", createdById: alice.id },
                { status: prisma_1.ApplicationStatus.IN_REVIEW, note: "CV shortlisted by HR", createdById: admins.tech.id },
                { status: prisma_1.ApplicationStatus.INTERVIEW, note: "Interview invitation sent", createdById: admins.tech.id },
            ],
            interview: {
                startsAt: addDays(3),
                endsAt: new Date(addDays(3).getTime() + hourMs),
                status: prisma_1.InterviewStatus.SCHEDULED,
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
            data: { userId: bob.id, jobId: jobs.dataScientist.id, cvUrl: "https://res.cloudinary.com/demo/cv/bob-data.pdf", cvFileName: "bob-data.pdf", cvFileSize: 210000, expectedSalary: 25000000, expectedSalaryCurrency: "IDR", status: prisma_1.ApplicationStatus.SUBMITTED, referralSource: "Career Portal" },
            timeline: [{ status: prisma_1.ApplicationStatus.SUBMITTED, note: "Awaiting review", createdById: bob.id }],
            preselection: { testId: tests.dataScientist.id, score: 14, passed: false, correctCount: 14 },
        },
        {
            key: "ginaUx",
            data: { userId: gina.id, jobId: jobs.uxDesigner.id, cvUrl: "https://res.cloudinary.com/demo/cv/gina-ux.pdf", cvFileName: "gina-ux.pdf", cvFileSize: 195000, expectedSalary: 17000000, expectedSalaryCurrency: "IDR", status: prisma_1.ApplicationStatus.ACCEPTED, reviewNote: "Offer accepted, onboarding scheduled", reviewUpdatedAt: now },
            timeline: [
                { status: prisma_1.ApplicationStatus.SUBMITTED, note: "Portfolio received", createdById: gina.id },
                { status: prisma_1.ApplicationStatus.IN_REVIEW, note: "Design challenge assigned", createdById: admins.creative.id },
                { status: prisma_1.ApplicationStatus.INTERVIEW, note: "Panel interview completed", createdById: admins.creative.id },
                { status: prisma_1.ApplicationStatus.ACCEPTED, note: "Candidate signed offer letter", createdById: admins.creative.id },
            ],
            interview: {
                startsAt: addDays(-2),
                endsAt: new Date(addDays(-2).getTime() + hourMs),
                status: prisma_1.InterviewStatus.COMPLETED,
                createdById: admins.creative.id,
                updatedById: admins.creative.id,
                locationOrLink: "Onsite - Creative Studio HQ",
                notes: "Conducted design critique and case study presentation.",
            },
        },
        {
            key: "charlieProduct",
            data: { userId: charlie.id, jobId: jobs.productManager.id, cvUrl: "https://res.cloudinary.com/demo/cv/charlie-product.pdf", cvFileName: "charlie-product.pdf", cvFileSize: 205000, expectedSalary: 28000000, expectedSalaryCurrency: "IDR", status: prisma_1.ApplicationStatus.REJECTED, reviewNote: "Looking for experience with enterprise lending products.", reviewUpdatedAt: now },
            attachments: [{ url: "https://res.cloudinary.com/demo/cv/charlie-case-study.pdf", fileName: "case-study.pdf", fileSize: 260000 }],
            timeline: [
                { status: prisma_1.ApplicationStatus.SUBMITTED, note: "Application submitted", createdById: charlie.id },
                { status: prisma_1.ApplicationStatus.IN_REVIEW, note: "Initial screening complete", createdById: admins.fintech.id },
                { status: prisma_1.ApplicationStatus.REJECTED, note: "Not a fit for current opening", createdById: admins.fintech.id },
            ],
        },
        {
            key: "dianaMarketing",
            data: { userId: diana.id, jobId: jobs.marketingSpecialist.id, cvUrl: "https://res.cloudinary.com/demo/cv/diana-marketing.pdf", cvFileName: "diana-marketing.pdf", cvFileSize: 198000, expectedSalary: 14000000, expectedSalaryCurrency: "IDR", status: prisma_1.ApplicationStatus.IN_REVIEW, referralSource: "Referral" },
            attachments: [{ url: "https://res.cloudinary.com/demo/cv/diana-campaign.pdf", fileName: "campaign-samples.pdf" }],
            timeline: [
                { status: prisma_1.ApplicationStatus.SUBMITTED, note: "Submitted via employee referral", createdById: diana.id },
                { status: prisma_1.ApplicationStatus.IN_REVIEW, note: "Awaiting marketing director feedback", createdById: admins.creative.id },
            ],
        },
        {
            key: "ekoCustomerSuccess",
            data: { userId: eko.id, jobId: jobs.customerSuccess.id, cvUrl: "https://res.cloudinary.com/demo/cv/eko-cs.pdf", cvFileName: "eko-cs.pdf", cvFileSize: 202000, expectedSalary: 22000000, expectedSalaryCurrency: "IDR", status: prisma_1.ApplicationStatus.ACCEPTED, reviewNote: "Excellent leadership experience, offer extended", reviewUpdatedAt: now, referralSource: "Talent Pool" },
            timeline: [
                { status: prisma_1.ApplicationStatus.SUBMITTED, note: "Submitted for confidential opening", createdById: eko.id },
                { status: prisma_1.ApplicationStatus.IN_REVIEW, note: "Hiring manager reviewing leadership experience", createdById: admins.tech.id },
                { status: prisma_1.ApplicationStatus.ACCEPTED, note: "Offer letter sent and accepted", createdById: admins.tech.id },
            ],
        },
    ];
    const applications = {};
    for (const seed of applicationSeeds) {
        const applicationData = {
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
            await (0, questionUtils_1.recordApplicantAnswers)({
                prisma,
                resultId: result.id,
                testId: seed.preselection.testId,
                correctCount: seed.preselection.correctCount,
            });
        }
    }
    // Add preselection results for testing users (without applications)
    // Professional Tester - Frontend pretest
    const testProfessionalFrontendResult = await prisma.preselectionResult.create({
        data: {
            userId: testProfessional.id,
            testId: tests.frontend.id,
            score: 20,
            passed: true,
        },
    });
    await (0, questionUtils_1.recordApplicantAnswers)({
        prisma,
        resultId: testProfessionalFrontendResult.id,
        testId: tests.frontend.id,
        correctCount: 20,
    });
    // Professional Tester - Data Scientist pretest
    const testProfessionalDataResult = await prisma.preselectionResult.create({
        data: {
            userId: testProfessional.id,
            testId: tests.dataScientist.id,
            score: 18,
            passed: true,
        },
    });
    await (0, questionUtils_1.recordApplicantAnswers)({
        prisma,
        resultId: testProfessionalDataResult.id,
        testId: tests.dataScientist.id,
        correctCount: 18,
    });
    // Standard Tester - Frontend pretest
    const testStandardFrontendResult = await prisma.preselectionResult.create({
        data: {
            userId: testStandard.id,
            testId: tests.frontend.id,
            score: 19,
            passed: true,
        },
    });
    await (0, questionUtils_1.recordApplicantAnswers)({
        prisma,
        resultId: testStandardFrontendResult.id,
        testId: tests.frontend.id,
        correctCount: 19,
    });
    // Standard Tester - Data Scientist pretest
    const testStandardDataResult = await prisma.preselectionResult.create({
        data: {
            userId: testStandard.id,
            testId: tests.dataScientist.id,
            score: 17,
            passed: true,
        },
    });
    await (0, questionUtils_1.recordApplicantAnswers)({
        prisma,
        resultId: testStandardDataResult.id,
        testId: tests.dataScientist.id,
        correctCount: 17,
    });
    return { applications: applications };
}
//# sourceMappingURL=applications.js.map