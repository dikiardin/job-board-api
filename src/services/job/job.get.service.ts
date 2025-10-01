import { GetJobRepository } from "../../repositories/job/job.get.repository";
import { CustomError } from "../../utils/customError";

export class GetJobService {
  public static async getAllJobs(filters?: {
    keyword?: string;
    city?: string;
  }) {
    const jobs = await GetJobRepository.getAllJobs(filters);

    return jobs.map((job) => ({
      id: job.id,
      title: job.title,
      category: job.category,
      city: job.city,
      tags: job.tags,
      salary:
        job.salaryMin && job.salaryMax
          ? `${job.salaryMin} - ${job.salaryMax}`
          : job.salaryMin
          ? `${job.salaryMin}+`
          : "Not specified",
      companyName: job.company.name,
      companyLogo: job.company.logo,
    }));
  }

  public static async getJobById(jobId: number) {
    const job = await GetJobRepository.findById(jobId);
    if (!job) {
      throw new CustomError("Job not found", 404);
    }
    return job;
  }
}
