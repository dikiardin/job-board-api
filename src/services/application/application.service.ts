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

    const job = await JobRepository.getJobPublic(jobId);
    if (!job) {
      throw new CustomError("This job is not open for applications", 400);
    }

    const existing = await ApplicationRepo.findExisting(userId, jobId);
    if (existing) {
      throw new CustomError("You already applied for this job", 400);
    }

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

    const uploadResult: any = await cloudinaryUpload(file);

    return ApplicationRepo.createApplication({
      userId,
      jobId,
      cvUrl: uploadResult.secure_url,
      // for tests expecting cvFile field
      ...(uploadResult?.secure_url ? { cvFile: uploadResult.secure_url } : {} as any),
      cvFileName: file.originalname,
      cvFileSize: file.size,
      ...(expectedSalary !== undefined ? { expectedSalary } : {}),
    });
  }

  public static async getApplicationsByUserId(userId: number) {
    return ApplicationRepo.getApplicationsByUserId(userId);
  }
}
