"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplicationController = void 0;
const application_service_1 = require("../../services/application/application.service");
const customError_1 = require("../../utils/customError");
class ApplicationController {
    static async applyJob(req, res, next) {
        try {
            const userId = res.locals.decrypt.userId;
            const jobSlug = req.params.jobSlug;
            if (!jobSlug) {
                throw new customError_1.CustomError("Job slug is required", 400);
            }
            const { expectedSalary } = req.body;
            if (!req.file) {
                throw new customError_1.CustomError("CV file is required", 400);
            }
            const application = await application_service_1.ApplicationService.submitApplicationBySlug(userId, jobSlug, req.file, expectedSalary ? parseInt(expectedSalary) : undefined);
            res.status(201).json({
                message: "Application submitted successfully",
                application,
            });
        }
        catch (err) {
            next(err);
        }
    }
    static async getApplicationsByUserId(req, res, next) {
        try {
            const userId = parseInt(req.params.userId, 10);
            if (isNaN(userId)) {
                return res.status(400).json({ message: "Invalid user id" });
            }
            const page = parseInt(req.query.page || "1", 10);
            const limit = parseInt(req.query.limit || "10", 10);
            const { applications, total } = await application_service_1.ApplicationService.getApplicationsByUserId(userId, page, limit);
            res.status(200).json({
                message: "Applications fetched successfully",
                data: applications,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(total / limit),
                },
            });
        }
        catch (err) {
            next(err);
        }
    }
}
exports.ApplicationController = ApplicationController;
//# sourceMappingURL=application.controller.js.map