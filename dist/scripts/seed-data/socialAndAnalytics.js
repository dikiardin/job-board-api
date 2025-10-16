"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedSocialAndAnalytics = seedSocialAndAnalytics;
const prisma_1 = require("../../generated/prisma");
async function seedSocialAndAnalytics({ prisma, users, companies, subscriptions, assessments, }) {
    const { seekers } = users;
    const { jobs } = companies;
    const { assessments: { data: dataAssessment }, } = assessments;
    await prisma.jobShare.createMany({
        data: [
            {
                userId: seekers.alice.id,
                jobId: jobs.frontend.id,
                platform: prisma_1.SharePlatform.LINKEDIN,
                sharedUrl: "https://jobboard.local/jobs/frontend",
                customMessage: "Excited to interview for this role!",
            },
            {
                userId: seekers.bob.id,
                jobId: jobs.dataScientist.id,
                platform: prisma_1.SharePlatform.WHATSAPP,
                customMessage: "Sharing this great data role!",
            },
            {
                userId: seekers.gina.id,
                jobId: jobs.uxDesigner.id,
                platform: prisma_1.SharePlatform.FACEBOOK,
                sharedUrl: "https://jobboard.local/jobs/ux-designer",
            },
        ],
    });
    await prisma.savedJob.createMany({
        data: [
            { userId: seekers.alice.id, jobId: jobs.dataScientist.id },
            { userId: seekers.bob.id, jobId: jobs.frontend.id },
            { userId: seekers.gina.id, jobId: jobs.productManager.id },
            { userId: seekers.charlie.id, jobId: jobs.uxDesigner.id },
        ],
    });
    await prisma.analyticsEvent.createMany({
        data: [
            {
                type: "job_view",
                userId: seekers.alice.id,
                payload: { jobId: jobs.frontend.id, source: "landing_page" },
                city: "Bandung",
                province: "Jawa Barat",
                gender: "Female",
                ageRange: "25-34",
            },
            {
                type: "job_apply",
                userId: seekers.bob.id,
                payload: { jobId: jobs.dataScientist.id },
                city: "Surabaya",
                province: "Jawa Timur",
                gender: "Male",
                ageRange: "25-34",
            },
            {
                type: "assessment_start",
                userId: seekers.gina.id,
                payload: { assessmentId: dataAssessment.id },
                city: "Jakarta",
                province: "DKI Jakarta",
                gender: "Female",
                ageRange: "25-34",
            },
            {
                type: "subscription_payment",
                userId: seekers.gina.id,
                payload: {
                    subscriptionId: subscriptions.ginaProfessional.id,
                    amount: 100000,
                },
                city: "Jakarta",
                province: "DKI Jakarta",
            },
        ],
    });
}
