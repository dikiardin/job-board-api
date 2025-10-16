"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplicationService = void 0;
const application_repository_1 = require("../../repositories/application/application.repository");
const cloudinary_1 = require("../../config/cloudinary");
const customError_1 = require("../../utils/customError");
const preselection_repository_1 = require("../../repositories/preselection/preselection.repository");
const job_repository_1 = require("../../repositories/job/job.repository");
const prisma_1 = require("../../generated/prisma");
const prisma = new prisma_1.PrismaClient();
class ApplicationService {
    static async submitApplicationBySlug(userId, jobSlug, file, expectedSalary) {
        if (!file)
            throw new customError_1.CustomError("CV file is required", 400);
        const job = await job_repository_1.JobRepository.getJobBySlug(jobSlug);
        if (!job) {
            throw new customError_1.CustomError("This job is not open for applications", 400);
        }
        const jobId = job.id;
        const existing = await application_repository_1.ApplicationRepo.findExisting(userId, jobId);
        if (existing) {
            throw new customError_1.CustomError("You already applied for this job", 400);
        }
        const test = await preselection_repository_1.PreselectionRepository.getTestByJobId(jobId);
        if (test && test.isActive) {
            const result = await preselection_repository_1.PreselectionRepository.getResult(userId, test.id);
            if (!result) {
                throw new customError_1.CustomError("Please complete the pre-selection test before applying", 400);
            }
            if (typeof test.passingScore === "number" &&
                result.score < test.passingScore) {
                throw new customError_1.CustomError("Your pre-selection test score does not meet the passing criteria", 400);
            }
        }
        const uploadResult = await (0, cloudinary_1.cloudinaryUpload)(file);
        // Check if user has Professional subscription for priority review
        const userSubscription = await prisma.subscription.findFirst({
            where: {
                userId,
                status: "ACTIVE",
            },
            include: {
                plan: true,
            },
        });
        const isPriority = userSubscription?.plan?.code === "PROFESSIONAL";
        return application_repository_1.ApplicationRepo.createApplication({
            userId,
            jobId,
            cvUrl: uploadResult.secure_url,
            ...(uploadResult?.secure_url
                ? { cvFile: uploadResult.secure_url }
                : {}),
            cvFileName: file.originalname,
            cvFileSize: file.size,
            ...(expectedSalary !== undefined ? { expectedSalary } : {}),
            isPriority,
        });
    }
    static async getApplicationsByUserId(userId, page = 1, limit = 10) {
        return application_repository_1.ApplicationRepo.getApplicationsByUserId(userId, page, limit);
    }
}
exports.ApplicationService = ApplicationService;
