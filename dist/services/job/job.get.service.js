"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetJobService = void 0;
const job_get_repository_1 = require("../../repositories/job/job.get.repository");
const customError_1 = require("../../utils/customError");
class GetJobService {
    static async getAllJobs(filters) {
        const [jobs, total] = await Promise.all([
            job_get_repository_1.GetJobRepository.getAllJobs(filters),
            job_get_repository_1.GetJobRepository.countJobs(filters),
        ]);
        const formattedJobs = jobs.map((job) => ({
            id: job.id,
            slug: job.slug,
            title: job.title,
            category: job.category,
            city: job.city,
            tags: job.tags,
            salary: job.salaryMin && job.salaryMax
                ? `${job.salaryMin} - ${job.salaryMax}`
                : job.salaryMin
                    ? `${job.salaryMin}+`
                    : "Not specified",
            companyName: job.company?.name,
            companyLogo: job.company?.logoUrl,
        }));
        return { jobs: formattedJobs, total };
    }
    static async getJobBySlug(slug) {
        const job = await job_get_repository_1.GetJobRepository.findBySlug(slug);
        if (!job) {
            throw new customError_1.CustomError("Job not found", 404);
        }
        return job;
    }
}
exports.GetJobService = GetJobService;
//# sourceMappingURL=job.get.service.js.map