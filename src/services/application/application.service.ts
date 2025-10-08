import { ApplicationRepo } from "../../repositories/application/application.repository";
import { cloudinaryUpload } from "../../config/cloudinary";
import { CustomError } from "../../utils/customError";
import { PreselectionRepository } from "../../repositories/preselection/preselection.repository";
import { JobRepository } from "../../repositories/job/job.repository";
import { PrismaClient } from "../../generated/prisma";

const prisma = new PrismaClient();

export class ApplicationService {
  public static async submitApplicationBySlug(
    userId: number,
    jobSlug: string,
    file: Express.Multer.File,
    expectedSalary?: number
  ) {
    if (!file) throw new CustomError("CV file is required", 400);

    const job = await JobRepository.getJobBySlug(jobSlug);
    if (!job) {
      throw new CustomError("This job is not open for applications", 400);
    }

    const jobId = job.id;

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

    // Check if user has Professional subscription for priority review
    const userSubscription = await prisma.subscription.findFirst({
      where: {
        userId,
        status: "ACTIVE",
      },
      include: {
        plan: true,
      },
    });

    const isPriority = userSubscription?.plan?.code === "PROFESSIONAL";

    return ApplicationRepo.createApplication({
      userId,
      jobId,
      cvUrl: uploadResult.secure_url,
      ...(uploadResult?.secure_url
        ? { cvFile: uploadResult.secure_url }
        : ({} as any)),
      cvFileName: file.originalname,
      cvFileSize: file.size,
      ...(expectedSalary !== undefined ? { expectedSalary } : {}),
      isPriority,
    });
  }
  public static async getApplicationsByUserId(
    userId: number,
    page = 1,
    limit = 10
  ) {
    return ApplicationRepo.getApplicationsByUserId(userId, page, limit);
  }
}
