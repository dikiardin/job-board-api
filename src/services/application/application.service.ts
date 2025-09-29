import { ApplicationRepo } from "../../repositories/application/application.repository";
import { cloudinaryUpload } from "../../config/cloudinary";
import { CustomError } from "../../utils/customError";
import { PreselectionRepository } from "../../repositories/preselection/preselection.repository";

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

    // Enforce preselection test gating
    const test = await PreselectionRepository.getTestByJobId(jobId);
    if (test && test.isActive) {
      const result = await PreselectionRepository.getResult(userId, test.id);
      if (!result) {
        throw new CustomError(
          "Please complete the pre-selection test before applying",
          400
        );
      }
      if (
        typeof test.passingScore === "number" &&
        result.score < test.passingScore
      ) {
        throw new CustomError(
          "Your pre-selection test score does not meet the passing criteria",
          400
        );
      }
    }

    const result: any = await cloudinaryUpload(file);

    return ApplicationRepo.createApplication({
      userId,
      jobId,
      cvFile: result.secure_url,
      ...(expectedSalary !== undefined ? { expectedSalary } : {}),
    });
  }

  public static async getApplicationsByUserId(userId: number) {
    return ApplicationRepo.getApplicationsByUserId(userId);
  }
}
