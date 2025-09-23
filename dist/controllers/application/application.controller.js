"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplicationController = void 0;
const application_service_1 = require("../../services/application/application.service");
class ApplicationController {
    static async create(req, res, next) {
        try {
            const jobId = Number(req.params.jobId);
            const { cvFile, expectedSalary } = req.body;
            const requester = res.locals.decrypt;
            const payload = {
                requesterId: requester.userId,
                requesterRole: requester.role,
                jobId,
                cvFile,
            };
            if (typeof expectedSalary === "number")
                payload.expectedSalary = expectedSalary;
            const app = await application_service_1.ApplicationService.createApplication(payload);
            res.status(201).json({ success: true, data: app });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.ApplicationController = ApplicationController;
//# sourceMappingURL=application.controller.js.map