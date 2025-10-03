import { ApplicationRepo } from "../../repositories/application/application.repository";
import { cloudinaryUpload } from "../../config/cloudinary";
import { CustomError } from "../../utils/customError";
import { PreselectionRepository } from "../../repositories/preselection/preselection.repository";
import { JobRepository } from "../../repositories/job/job.repository";

export class ApplicationService {
  public static async submitApplication(
    userId: number,
    jobId: string,
    file: Express.Multer.File,
    expectedSalary?: number
  ) {
    if (!file) throw new CustomError("CV file is required", 400);

    // Ensure job is open for applications (published and not past deadline)
    const job = await JobRepository.getJobPublic(jobId);
    if (!job) {
      throw new CustomError("This job is not open for applications", 400);
    }

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
