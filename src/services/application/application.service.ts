// import { ApplicationRepository } from "../../repositories/application/application.repository";
// import { UserRole } from "../../generated/prisma";

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

import { ApplicationRepo } from "../../repositories/application/application.repository";
import { cloudinaryUpload } from "../../config/cloudinary";
import { CustomError } from "../../utils/customError";

export class ApplicationService {
  public static async submitApplication(
    userId: number,
    jobId: number,
    file: Express.Multer.File,
    expectedSalary?: number
  ) {
    if (!file) throw new CustomError("CV file is required", 400);

    const existing = await ApplicationRepo.findExisting(userId, jobId);
    if (existing) {
      throw new CustomError("You already applied for this job", 400);
    }

    const result: any = await cloudinaryUpload(file);

    return ApplicationRepo.createApplication({
      userId,
      jobId,
      cvFile: result.secure_url,
      ...(expectedSalary !== undefined ? { expectedSalary } : {}),
    });
  }
}
