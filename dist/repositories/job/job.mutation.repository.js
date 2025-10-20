"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createJob = createJob;
exports.updateJob = updateJob;
exports.togglePublish = togglePublish;
exports.deleteJob = deleteJob;
const prisma_1 = require("../../config/prisma");
async function createJob(companyId, data) {
    const cid = typeof companyId === "string" ? Number(companyId) : companyId;
    return prisma_1.prisma.job.create({
        data: {
            companyId: cid,
            title: data.title,
            description: data.description,
            bannerUrl: data.banner ?? null,
            category: data.category,
            city: data.city,
            salaryMin: data.salaryMin ?? null,
            salaryMax: data.salaryMax ?? null,
            tags: data.tags,
            applyDeadline: data.deadline ?? null,
            isPublished: data.isPublished ?? false,
        },
    });
}
async function updateJob(companyId, jobId, data) {
    const jid = typeof jobId === "string" ? Number(jobId) : jobId;
    const updateData = {};
    if (data.title !== undefined)
        updateData.title = data.title;
    if (data.description !== undefined)
        updateData.description = data.description;
    if (data.category !== undefined)
        updateData.category = data.category;
    if (data.city !== undefined)
        updateData.city = data.city;
    if (data.employmentType !== undefined)
        updateData.employmentType = data.employmentType;
    if (data.experienceLevel !== undefined)
        updateData.experienceLevel = data.experienceLevel;
    if (data.salaryMin !== undefined)
        updateData.salaryMin = data.salaryMin;
    if (data.salaryMax !== undefined)
        updateData.salaryMax = data.salaryMax;
    if (data.tags !== undefined)
        updateData.tags = data.tags;
    if (data.isPublished !== undefined)
        updateData.isPublished = data.isPublished;
    if (data.banner !== undefined)
        updateData.bannerUrl = data.banner;
    if (data.deadline !== undefined)
        updateData.applyDeadline = data.deadline;
    return prisma_1.prisma.job.update({ where: { id: jid }, data: updateData });
}
async function togglePublish(jobId, isPublished) {
    const jid = typeof jobId === "string" ? Number(jobId) : jobId;
    return prisma_1.prisma.job.update({ where: { id: jid }, data: { isPublished } });
}
async function deleteJob(companyId, jobId) {
    const jid = typeof jobId === "string" ? Number(jobId) : jobId;
    return prisma_1.prisma.job.delete({ where: { id: jid } });
}
