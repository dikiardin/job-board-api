"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearDatabase = clearDatabase;
async function clearDatabase(prisma) {
    await prisma.analyticsEvent.deleteMany();
    await prisma.applicationAttachment.deleteMany();
    await prisma.applicationTimeline.deleteMany();
    await prisma.interview.deleteMany();
    await prisma.application.deleteMany();
    await prisma.savedJob.deleteMany();
    await prisma.jobShare.deleteMany();
    await prisma.applicantAnswer.deleteMany();
    await prisma.preselectionResult.deleteMany();
    await prisma.preselectionQuestion.deleteMany();
    await prisma.preselectionTest.deleteMany();
    await prisma.certificate.deleteMany();
    await prisma.skillResult.deleteMany();
    await prisma.skillQuestion.deleteMany();
    await prisma.skillAssessment.deleteMany();
    await prisma.userBadge.deleteMany();
    await prisma.badge.deleteMany();
    await prisma.badgeTemplate.deleteMany();
    await prisma.generatedCV.deleteMany();
    await prisma.payment.deleteMany();
    await prisma.subscription.deleteMany();
    await prisma.subscriptionPlan.deleteMany();
    await prisma.companyReview.deleteMany();
    await prisma.employment.deleteMany();
    await prisma.job.deleteMany();
    await prisma.company.deleteMany();
    await prisma.userProvider.deleteMany();
    await prisma.userProfile.deleteMany();
    await prisma.locationCache.deleteMany();
    await prisma.user.deleteMany();
}
//# sourceMappingURL=clearDatabase.js.map