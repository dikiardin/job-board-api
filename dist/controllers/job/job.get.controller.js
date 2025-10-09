"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetJobController = void 0;
const job_get_service_1 = require("../../services/job/job.get.service");
class GetJobController {
    static async getAllJobs(req, res, next) {
        try {
            const { keyword, city, limit = "9", page = "1", sortBy = "createdAt", sortOrder = "desc", } = req.query;
            const numericLimit = parseInt(limit, 10);
            const numericPage = parseInt(page, 10);
            const offset = (numericPage - 1) * numericLimit;
            const { jobs, total } = await job_get_service_1.GetJobService.getAllJobs({
                keyword: keyword,
                city: city,
                limit: numericLimit,
                offset,
                sortBy: sortBy,
                sortOrder: sortOrder || "desc",
            });
            res.status(200).json({
                message: "Jobs fetched successfully",
                data: jobs,
                total,
            });
        }
        catch (err) {
            next(err);
        }
    }
    static async getJobBySlug(req, res, next) {
        try {
            const { slug } = req.params;
            if (!slug) {
                return res.status(400).json({ message: "Job slug is required" });
            }
            const job = await job_get_service_1.GetJobService.getJobBySlug(slug);
            if (!job) {
                return res.status(404).json({ message: "Job not found" });
            }
            res.status(200).json({
                message: "Job fetched successfully",
                data: job,
            });
        }
        catch (err) {
            next(err);
        }
    }
}
exports.GetJobController = GetJobController;
//# sourceMappingURL=job.get.controller.js.map