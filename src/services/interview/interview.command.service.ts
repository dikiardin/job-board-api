import { InterviewStatus, UserRole, ApplicationStatus } from "../../generated/prisma";
import { prisma } from "../../config/prisma";
import { InterviewRepository } from "../../repositories/interview/interview.repository";
import { assertCompanyOwnershipByJob, assertCompanyOwnershipByInterview, validatePayload, validateAdminAccess } from "./helpers/interview.validation";
import { getApplicationsForJob, prepareInterviewSchedules } from "./helpers/interview.preparation";
import { sendInterviewEmails } from "./helpers/interview.notification";
export class InterviewCommandService {
  static async createMany(params: {
    companyId: string | number;
    jobId: string | number;
    requesterId: number;
    requesterRole: UserRole;
    body: { items: Array<{ applicantId: number; scheduleDate: string | Date; locationOrLink?: string | null; notes?: string | null }> };
  }) {
    const { jobId, requesterId, requesterRole, body } = params;
    
    validateAdminAccess(requesterRole);
    await assertCompanyOwnershipByJob(jobId, requesterId);
    validatePayload(body);
    
    const applications = await getApplicationsForJob(jobId, body.items);
    const toCreate = await prepareInterviewSchedules(body.items, applications);
    const created = await InterviewRepository.createMany(toCreate);
    
    // Send email notifications, but don't fail the request if email delivery breaks
    for (const it of created as any[]) {
      try {
        await sendInterviewEmails(it, "created");
      } catch (emailError) {
        console.error("Failed to send interview creation emails:", emailError);
        // continue without interrupting schedule creation
      }
    }
    
    return created;
  }

  static async update(params: {
    id: number;
    requesterId: number;
    requesterRole: UserRole;
    body: { scheduleDate?: string | Date; locationOrLink?: string | null; notes?: string | null; status?: InterviewStatus };
  }) {
    const { id, requesterId, requesterRole, body } = params;
    if (requesterRole !== UserRole.ADMIN) throw { status: 401, message: "Only company admin can update schedule" };
    const interview = await assertCompanyOwnershipByInterview(id, requesterId);
    validatePayload(body, true);
    const updateData: any = {};
    
    // Handle non-date fields
    if (typeof body.notes !== "undefined") updateData.notes = body.notes;
    if (typeof body.locationOrLink !== "undefined") updateData.locationOrLink = body.locationOrLink;
    if (typeof body.status !== "undefined") updateData.status = body.status;
    
    // Handle date field separately
    if (typeof body.scheduleDate !== "undefined") {
      const d = new Date(body.scheduleDate as any);
      if (isNaN(d.getTime())) throw { status: 400, message: "scheduleDate must be a valid date" };
      if (d.getTime() <= Date.now()) throw { status: 400, message: "scheduleDate cannot be in the past" };
      
      const conflict = await InterviewRepository.findConflicts(interview.applicationId, new Date(d.getTime()), new Date(d.getTime()));
      if (conflict && conflict.id !== id) throw { status: 400, message: "Schedule conflict for this application" };
      
      updateData.startsAt = d;
      updateData.reminderSentAt = null;
      updateData.status = InterviewStatus.SCHEDULED;
    }
    
    const updated = (await InterviewRepository.updateOne(id, updateData)) as any;
    
    const scheduleChanged =
      updateData.startsAt instanceof Date ||
      typeof updateData.locationOrLink !== "undefined" ||
      typeof updateData.notes !== "undefined";
    const isCancellation = updateData.status === InterviewStatus.CANCELLED;
    const isCompletion = updateData.status === InterviewStatus.COMPLETED;

    if ((scheduleChanged || isCancellation) && !isCompletion) {
      try {
        const type = isCancellation ? "cancelled" : "updated";
        await sendInterviewEmails(updated, type);
      } catch (emailError) {
        console.error("Failed to send update emails:", emailError);
        // Continue with update even if email fails
      }
    }
    
    return updated;
  }
  static async remove(params: { id: number; requesterId: number; requesterRole: UserRole }) {
    const { id, requesterId, requesterRole } = params;
    if (requesterRole !== UserRole.ADMIN) throw { status: 401, message: "Only company admin can delete schedule" };
    const interview = await assertCompanyOwnershipByInterview(id, requesterId);
    
    await InterviewRepository.deleteOne(id);
    return { success: true };
  }
}
