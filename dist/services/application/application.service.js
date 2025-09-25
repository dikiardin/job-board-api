"use strict";
// import { ApplicationRepository } from "../../repositories/application/application.repository";
// import { UserRole } from "../../generated/prisma";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplicationService = void 0;
// export class ApplicationService {
//   static async createApplication(params: {
//     requesterId: number;
//     requesterRole: UserRole;
//     jobId: number;
//     cvFile: string;
//     expectedSalary?: number;
//   }) {
//     const { requesterId, requesterRole, jobId, cvFile, expectedSalary } = params;
//     if (requesterRole !== UserRole.USER) throw { status: 401, message: "Only applicants can submit applications" };
//     if (!cvFile) throw { status: 400, message: "cvFile is required" };
//     const test = await ApplicationRepository.getPreselectionTestByJob(jobId);
//     if (test && test.isActive) {
//       // If passingScore is set, require pass; otherwise require submission
//       const result = await ApplicationRepository.getPreselectionResult(requesterId, test.id);
//       if (!result) throw { status: 400, message: "Please complete the pre-selection test before applying" };
//       if (test.passingScore != null && result.score < test.passingScore) {
//         throw { status: 400, message: "Your pre-selection test score does not meet the passing criteria" };
//       }
//     }
//     const payload: any = { userId: requesterId, jobId, cvFile };
//     if (typeof expectedSalary === "number") payload.expectedSalary = expectedSalary;
//     const application = await ApplicationRepository.createApplication(payload);
//     return application;
//   }
// }
const application_repository_1 = require("../../repositories/application/application.repository");
const cloudinary_1 = require("../../config/cloudinary");
const customError_1 = require("../../utils/customError");
class ApplicationService {
    static async submitApplication(userId, jobId, file, expectedSalary) {
        if (!file)
            throw new customError_1.CustomError("CV file is required", 400);
        const existing = await application_repository_1.ApplicationRepo.findExisting(userId, jobId);
        if (existing) {
            throw new customError_1.CustomError("You already applied for this job", 400);
        }
        const result = await (0, cloudinary_1.cloudinaryUpload)(file);
        return application_repository_1.ApplicationRepo.createApplication({
            userId,
            jobId,
            cvFile: result.secure_url,
            ...(expectedSalary !== undefined ? { expectedSalary } : {}),
        });
    }
}
exports.ApplicationService = ApplicationService;
//# sourceMappingURL=application.service.js.map