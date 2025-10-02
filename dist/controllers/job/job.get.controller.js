"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetJobController = void 0;
const job_get_service_1 = require("../../services/job/job.get.service");
class GetJobController {
    static async getAllJobs(req, res, next) {
        try {
            const { keyword, city, limit = "9", page = "1" } = req.query;
            const numericLimit = parseInt(limit, 10);
            const numericPage = parseInt(page, 10);
            const offset = (numericPage - 1) * numericLimit;
            const { jobs, total } = await job_get_service_1.GetJobService.getAllJobs({
                keyword: keyword,
                city: city,
                limit: numericLimit,
                offset,
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
    static async getJobById(req, res, next) {
        try {
            const { jobId: jobIdParam } = req.params;
            if (!jobIdParam) {
                return res.status(400).json({ message: "Job ID is required" });
            }
            const jobId = Number(jobIdParam);
            if (isNaN(jobId)) {
                return res.status(400).json({ message: "Invalid job ID" });
            }
            const job = await job_get_service_1.GetJobService.getJobById(jobId);
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