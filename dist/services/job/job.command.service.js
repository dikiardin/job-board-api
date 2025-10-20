"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createJobCore = createJobCore;
exports.updateJobCore = updateJobCore;
exports.togglePublishCore = togglePublishCore;
exports.deleteJobCore = deleteJobCore;
const job_repository_1 = require("../../repositories/job/job.repository");
async function createJobCore(params) {
    const { companyId, body } = params;
    const job = await job_repository_1.JobRepository.createJob(companyId, {
        title: body.title,
        description: body.description,
        banner: body.banner ?? null,
        category: body.category,
        city: body.city,
        salaryMin: body.salaryMin ?? null,
        salaryMax: body.salaryMax ?? null,
        tags: body.tags ?? [],
        deadline: body.deadline ? new Date(body.deadline) : null,
        isPublished: body.isPublished ?? false,
    });
    return job;
}
async function updateJobCore(params) {
    const { companyId, jobId, body } = params;
    const updateData = {};
    if (body.title !== undefined)
        updateData.title = body.title;
    if (body.description !== undefined)
        updateData.description = body.description;
    if (body.category !== undefined)
        updateData.category = body.category;
    if (body.city !== undefined)
        updateData.city = body.city;
    if (body.employmentType !== undefined)
        updateData.employmentType = body.employmentType;
    if (body.experienceLevel !== undefined)
        updateData.experienceLevel = body.experienceLevel;
    if (body.salaryMin !== undefined)
        updateData.salaryMin = body.salaryMin;
    if (body.salaryMax !== undefined)
        updateData.salaryMax = body.salaryMax;
    if (body.tags !== undefined)
        updateData.tags = body.tags;
    if (body.banner !== undefined)
        updateData.banner = body.banner;
    if (body.isPublished !== undefined)
        updateData.isPublished = body.isPublished;
    if (body.deadline !== undefined)
        updateData.deadline = body.deadline ? new Date(body.deadline) : null;
    const job = await job_repository_1.JobRepository.updateJob(companyId, jobId, updateData);
    return job;
}
async function togglePublishCore(params) {
    const { companyId, jobId, isPublished } = params;
    const detail = await job_repository_1.JobRepository.getJobById(companyId, jobId);
    if (!detail)
        throw { status: 404, message: "Job not found" };
    const nextState = typeof isPublished === "boolean" ? isPublished : !detail.isPublished;
    const updated = await job_repository_1.JobRepository.togglePublish(jobId, nextState);
    return updated;
}
async function deleteJobCore(params) {
    const { companyId, jobId } = params;
    await job_repository_1.JobRepository.deleteJob(companyId, jobId);
    return { success: true };
}
