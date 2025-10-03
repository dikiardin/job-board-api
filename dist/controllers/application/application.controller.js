"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplicationController = void 0;
const application_service_1 = require("../../services/application/application.service");
const customError_1 = require("../../utils/customError");
class ApplicationController {
    static async applyJob(req, res, next) {
        try {
            const userId = res.locals.decrypt.userId;
            const jobIdParam = req.params.jobId;
            if (!jobIdParam) {
                throw new customError_1.CustomError("Job ID is required", 400);
            }
            const jobId = jobIdParam;
            const { expectedSalary } = req.body;
            if (!req.file) {
                throw new customError_1.CustomError("CV file is required", 400);
            }
            const application = await application_service_1.ApplicationService.submitApplication(userId, jobId, req.file, expectedSalary ? parseInt(expectedSalary) : undefined);
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
            const applications = await application_service_1.ApplicationService.getApplicationsByUserId(userId);
            res.status(200).json({
                message: "Applications fetched successfully",
                data: applications,
            });
        }
        catch (err) {
            next(err);
        }
    }
}
exports.ApplicationController = ApplicationController;
//# sourceMappingURL=application.controller.js.map