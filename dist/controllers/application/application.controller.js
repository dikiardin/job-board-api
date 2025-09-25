"use strict";
// import { Request, Response, NextFunction } from "express";
// import { ApplicationService } from "../../services/application/application.service";
// import { UserRole } from "../../generated/prisma";
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
            const jobId = parseInt(jobIdParam, 10);
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
}
exports.ApplicationController = ApplicationController;
//# sourceMappingURL=application.controller.js.map