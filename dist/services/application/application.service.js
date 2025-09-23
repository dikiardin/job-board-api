"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplicationService = void 0;
const application_repository_1 = require("../../repositories/application/application.repository");
const prisma_1 = require("../../generated/prisma");
class ApplicationService {
    static async createApplication(params) {
        const { requesterId, requesterRole, jobId, cvFile, expectedSalary } = params;
        if (requesterRole !== prisma_1.UserRole.USER)
            throw { status: 401, message: "Only applicants can submit applications" };
        if (!cvFile)
            throw { status: 400, message: "cvFile is required" };
        const test = await application_repository_1.ApplicationRepository.getPreselectionTestByJob(jobId);
        if (test && test.isActive) {
            // If passingScore is set, require pass; otherwise require submission
            const result = await application_repository_1.ApplicationRepository.getPreselectionResult(requesterId, test.id);
            if (!result)
                throw { status: 400, message: "Please complete the pre-selection test before applying" };
            if (test.passingScore != null && result.score < test.passingScore) {
                throw { status: 400, message: "Your pre-selection test score does not meet the passing criteria" };
            }
        }
        const payload = { userId: requesterId, jobId, cvFile };
        if (typeof expectedSalary === "number")
            payload.expectedSalary = expectedSalary;
        const application = await application_repository_1.ApplicationRepository.createApplication(payload);
        return application;
    }
}
exports.ApplicationService = ApplicationService;
//# sourceMappingURL=application.service.js.map