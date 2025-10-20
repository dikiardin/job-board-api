"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getApplicationsForJob = getApplicationsForJob;
exports.prepareInterviewSchedules = prepareInterviewSchedules;
const prisma_1 = require("../../../generated/prisma");
const prisma_2 = require("../../../config/prisma");
const interview_repository_1 = require("../../../repositories/interview/interview.repository");
async function getApplicationsForJob(jobId, items) {
    const jid = typeof jobId === 'string' ? Number(jobId) : jobId;
    return await prisma_2.prisma.application.findMany({
        where: { jobId: jid, userId: { in: items.map((i) => i.applicantId) } },
        include: { user: true },
    });
}
async function prepareInterviewSchedules(items, applications) {
    const appByUser = new Map(applications.map((a) => [a.userId, a]));
    const toCreate = [];
    for (const it of items) {
        const app = appByUser.get(it.applicantId);
        if (!app)
            throw { status: 400, message: `Applicant ${it.applicantId} has no application for this job` };
        if (app.status !== prisma_1.ApplicationStatus.ACCEPTED)
            throw { status: 400, message: `Applicant ${it.applicantId} is not in ACCEPTED status` };
        const scheduleDate = new Date(it.scheduleDate);
        const conflict = await interview_repository_1.InterviewRepository.findConflicts(app.id, new Date(scheduleDate.getTime()), new Date(scheduleDate.getTime()));
        if (conflict)
            throw { status: 400, message: `Schedule conflict for applicant ${it.applicantId}` };
        toCreate.push({ applicationId: app.id, startsAt: scheduleDate, locationOrLink: it.locationOrLink ?? null, notes: it.notes ?? null });
    }
    return toCreate;
}
