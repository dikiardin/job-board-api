"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InterviewCommandService = void 0;
const prisma_1 = require("../../generated/prisma");
const interview_repository_1 = require("../../repositories/interview/interview.repository");
const interview_validation_1 = require("./helpers/interview.validation");
const interview_preparation_1 = require("./helpers/interview.preparation");
const interview_notification_1 = require("./helpers/interview.notification");
class InterviewCommandService {
    static async createMany(params) {
        const { jobId, requesterId, requesterRole, body } = params;
        (0, interview_validation_1.validateAdminAccess)(requesterRole);
        await (0, interview_validation_1.assertCompanyOwnershipByJob)(jobId, requesterId);
        (0, interview_validation_1.validatePayload)(body);
        const applications = await (0, interview_preparation_1.getApplicationsForJob)(jobId, body.items);
        const toCreate = await (0, interview_preparation_1.prepareInterviewSchedules)(body.items, applications);
        const created = await interview_repository_1.InterviewRepository.createMany(toCreate);
        // Send email notifications
        for (const it of created) {
            await (0, interview_notification_1.sendInterviewEmails)(it, "created");
        }
        return created;
    }
    static async update(params) {
        const { id, requesterId, requesterRole, body } = params;
        if (requesterRole !== prisma_1.UserRole.ADMIN)
            throw { status: 401, message: "Only company admin can update schedule" };
        const interview = await (0, interview_validation_1.assertCompanyOwnershipByInterview)(id, requesterId);
        (0, interview_validation_1.validatePayload)(body, true);
        const updateData = {};
        // Handle non-date fields
        if (typeof body.notes !== "undefined")
            updateData.notes = body.notes;
        if (typeof body.locationOrLink !== "undefined")
            updateData.locationOrLink = body.locationOrLink;
        if (typeof body.status !== "undefined")
            updateData.status = body.status;
        // Handle date field separately
        if (typeof body.scheduleDate !== "undefined") {
            const d = new Date(body.scheduleDate);
            if (isNaN(d.getTime()))
                throw { status: 400, message: "scheduleDate must be a valid date" };
            if (d.getTime() <= Date.now())
                throw { status: 400, message: "scheduleDate cannot be in the past" };
            const conflict = await interview_repository_1.InterviewRepository.findConflicts(interview.applicationId, new Date(d.getTime()), new Date(d.getTime()));
            if (conflict && conflict.id !== id)
                throw { status: 400, message: "Schedule conflict for this application" };
            updateData.startsAt = d;
            updateData.reminderSentAt = null;
            updateData.status = prisma_1.InterviewStatus.SCHEDULED;
        }
        const updated = (await interview_repository_1.InterviewRepository.updateOne(id, updateData));
        // Send email notifications
        try {
            const type = updateData.status === prisma_1.InterviewStatus.CANCELLED ? "cancelled" : "updated";
            await (0, interview_notification_1.sendInterviewEmails)(updated, type);
        }
        catch (emailError) {
            console.error("Failed to send update emails:", emailError);
            // Continue with update even if email fails
        }
        return updated;
    }
    static async remove(params) {
        const { id, requesterId, requesterRole } = params;
        if (requesterRole !== prisma_1.UserRole.ADMIN)
            throw { status: 401, message: "Only company admin can delete schedule" };
        const interview = await (0, interview_validation_1.assertCompanyOwnershipByInterview)(id, requesterId);
        // Try to send cancellation emails, but don't fail the delete operation if email fails
        try {
            await (0, interview_notification_1.sendInterviewEmails)(interview, "cancelled");
        }
        catch (emailError) {
            console.error("Failed to send cancellation emails:", emailError);
            // Continue with deletion even if email fails
        }
        await interview_repository_1.InterviewRepository.deleteOne(id);
        return { success: true };
    }
}
exports.InterviewCommandService = InterviewCommandService;
