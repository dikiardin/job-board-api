"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InterviewCommandService = void 0;
const prisma_1 = require("../../generated/prisma");
const prisma_2 = require("../../config/prisma");
const interview_repository_1 = require("../../repositories/interview/interview.repository");
const interviewEmail_service_1 = require("./interviewEmail.service");
async function assertCompanyOwnershipByJob(jobId, requesterId) {
    const job = await prisma_2.prisma.job.findUnique({ where: { id: jobId }, include: { company: true } });
    if (!job)
        throw { status: 404, message: "Job not found" };
    if (job.company.adminId !== requesterId)
        throw { status: 403, message: "You don't own this company" };
    return job.companyId;
}
async function assertCompanyOwnershipByInterview(interviewId, requesterId) {
    const interview = await prisma_2.prisma.interview.findUnique({
        where: { id: interviewId },
        include: { application: { include: { job: { include: { company: true } } } } },
    });
    if (!interview)
        throw { status: 404, message: "Interview not found" };
    if (interview.application.job.company.adminId !== requesterId)
        throw { status: 403, message: "You don't own this company" };
    return interview;
}
function validatePayload(payload, isUpdate = false) {
    const errors = [];
    if (!isUpdate) {
        if (!payload || !Array.isArray(payload.items) || payload.items.length === 0) {
            errors.push("items is required and must be a non-empty array");
        }
    }
    if (payload?.items) {
        for (const it of payload.items) {
            if (typeof it.applicantId !== "number")
                errors.push("items[].applicantId must be number");
            if (!it.scheduleDate)
                errors.push("items[].scheduleDate is required");
            const d = new Date(it.scheduleDate);
            if (isNaN(d.getTime()))
                errors.push("items[].scheduleDate must be a valid date");
            else if (d.getTime() <= Date.now())
                errors.push("scheduleDate cannot be in the past");
        }
    }
    if (payload?.scheduleDate) {
        const d = new Date(payload.scheduleDate);
        if (isNaN(d.getTime()))
            errors.push("scheduleDate must be a valid date");
        else if (d.getTime() <= Date.now())
            errors.push("scheduleDate cannot be in the past");
    }
    if (errors.length)
        throw { status: 400, message: errors.join(", ") };
}
class InterviewCommandService {
    static async createMany(params) {
        const { jobId, requesterId, requesterRole, body } = params;
        if (requesterRole !== prisma_1.UserRole.ADMIN)
            throw { status: 401, message: "Only company admin can create schedules" };
        await assertCompanyOwnershipByJob(jobId, requesterId);
        validatePayload(body);
        const applications = await prisma_2.prisma.application.findMany({
            where: { jobId, userId: { in: body.items.map((i) => i.applicantId) } },
            include: { user: true },
        });
        const appByUser = new Map(applications.map((a) => [a.userId, a]));
        const toCreate = [];
        for (const it of body.items) {
            const app = appByUser.get(it.applicantId);
            if (!app)
                throw { status: 400, message: `Applicant ${it.applicantId} has no application for this job` };
            if (app.status !== prisma_1.ApplicationStatus.ACCEPTED)
                throw { status: 400, message: `Applicant ${it.applicantId} is not in ACCEPTED status` };
            const scheduleDate = new Date(it.scheduleDate);
            const conflict = await interview_repository_1.InterviewRepository.findConflicts(app.id, new Date(scheduleDate.getTime()), new Date(scheduleDate.getTime()));
            if (conflict)
                throw { status: 400, message: `Schedule conflict for applicant ${it.applicantId}` };
            toCreate.push({ applicationId: app.id, scheduleDate, locationOrLink: it.locationOrLink ?? null, notes: it.notes ?? null });
        }
        const created = await interview_repository_1.InterviewRepository.createMany(toCreate);
        await prisma_2.prisma.application.updateMany({ where: { id: { in: created.map((c) => c.applicationId) } }, data: { status: "INTERVIEW" } });
        for (const it of created) {
            const candidateEmail = it.application.user.email;
            const candidateName = it.application.user.name;
            const jobTitle = it.application.job.title;
            const companyName = it.application.job.company.name;
            const adminEmail = it.application.job.company.admin?.email || undefined;
            const adminName = it.application.job.company.admin?.name || null;
            await interviewEmail_service_1.InterviewEmailService.sendCandidateEmail({
                type: "created",
                to: candidateEmail,
                candidateName,
                adminName,
                jobTitle,
                companyName,
                scheduleDate: new Date(it.scheduleDate),
                locationOrLink: it.locationOrLink ?? null,
                notes: it.notes ?? null,
            });
            if (adminEmail) {
                await interviewEmail_service_1.InterviewEmailService.sendAdminEmail({
                    type: "created",
                    to: adminEmail,
                    adminName: adminName || "Admin",
                    candidateName,
                    jobTitle,
                    companyName,
                    scheduleDate: new Date(it.scheduleDate),
                    locationOrLink: it.locationOrLink ?? null,
                    notes: it.notes ?? null,
                });
            }
        }
        return created;
    }
    static async update(params) {
        const { id, requesterId, requesterRole, body } = params;
        if (requesterRole !== prisma_1.UserRole.ADMIN)
            throw { status: 401, message: "Only company admin can update schedule" };
        const interview = await assertCompanyOwnershipByInterview(id, requesterId);
        validatePayload(body, true);
        const updateData = { ...body };
        if (typeof body.scheduleDate !== "undefined") {
            const d = new Date(body.scheduleDate);
            if (isNaN(d.getTime()))
                throw { status: 400, message: "scheduleDate must be a valid date" };
            if (d.getTime() <= Date.now())
                throw { status: 400, message: "scheduleDate cannot be in the past" };
            const conflict = await interview_repository_1.InterviewRepository.findConflicts(interview.applicationId, new Date(d.getTime()), new Date(d.getTime()));
            if (conflict && conflict.id !== id)
                throw { status: 400, message: "Schedule conflict for this application" };
            updateData.scheduleDate = d;
            updateData.reminderSentAt = null;
            updateData.status = prisma_1.InterviewStatus.SCHEDULED;
        }
        const updated = (await interview_repository_1.InterviewRepository.updateOne(id, updateData));
        const type = updateData.status === prisma_1.InterviewStatus.CANCELLED ? "cancelled" : "updated";
        const candidateEmail = updated.application.user.email;
        const candidateName = updated.application.user.name;
        const jobTitle = updated.application.job.title;
        const companyName = updated.application.job.company.name;
        const adminEmail = updated.application.job.company.admin?.email || undefined;
        const adminName = updated.application.job.company.admin?.name || null;
        await interviewEmail_service_1.InterviewEmailService.sendCandidateEmail({
            type,
            to: candidateEmail,
            candidateName,
            adminName,
            jobTitle,
            companyName,
            scheduleDate: new Date(updated.scheduleDate),
            locationOrLink: updated.locationOrLink ?? null,
            notes: updated.notes ?? null,
        });
        if (adminEmail) {
            await interviewEmail_service_1.InterviewEmailService.sendAdminEmail({
                type,
                to: adminEmail,
                adminName: adminName || "Admin",
                candidateName,
                jobTitle,
                companyName,
                scheduleDate: new Date(updated.scheduleDate),
                locationOrLink: updated.locationOrLink ?? null,
                notes: updated.notes ?? null,
            });
        }
        return updated;
    }
    static async remove(params) {
        const { id, requesterId, requesterRole } = params;
        if (requesterRole !== prisma_1.UserRole.ADMIN)
            throw { status: 401, message: "Only company admin can delete schedule" };
        const interview = await assertCompanyOwnershipByInterview(id, requesterId);
        const candidateEmail = interview.application.user.email;
        const candidateName = interview.application.user.name;
        const jobTitle = interview.application.job.title;
        const companyName = interview.application.job.company.name;
        const adminEmail = interview.application.job.company.admin?.email;
        const adminName = interview.application.job.company.admin?.name || null;
        await interviewEmail_service_1.InterviewEmailService.sendCandidateEmail({
            type: "cancelled",
            to: candidateEmail,
            candidateName,
            adminName,
            jobTitle,
            companyName,
            scheduleDate: new Date(interview.scheduleDate),
            locationOrLink: interview.locationOrLink ?? null,
            notes: interview.notes ?? null,
        });
        if (adminEmail) {
            await interviewEmail_service_1.InterviewEmailService.sendAdminEmail({
                type: "cancelled",
                to: adminEmail,
                adminName: adminName || "Admin",
                candidateName,
                jobTitle,
                companyName,
                scheduleDate: new Date(interview.scheduleDate),
                locationOrLink: interview.locationOrLink ?? null,
                notes: interview.notes ?? null,
            });
        }
        await interview_repository_1.InterviewRepository.deleteOne(id);
        return { success: true };
    }
}
exports.InterviewCommandService = InterviewCommandService;
//# sourceMappingURL=interview.command.service.js.map