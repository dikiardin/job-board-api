import { GetJobRepository } from "../../repositories/job/job.get.repository";
import { CustomError } from "../../utils/customError";

export class GetJobService {
  public static async getAllJobs(filters?: {
    keyword?: string;
    city?: string;
    limit?: number;
    offset?: number;
    sortBy?: "createdAt"; 
    sortOrder?: "asc" | "desc";
  }) {
    const [jobs, total] = await Promise.all([
      GetJobRepository.getAllJobs(filters),
      GetJobRepository.countJobs(filters),
    ]);
    const formattedJobs = jobs.map((job) => ({
      id: job.id,
      slug: job.slug,
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
      companyName: (job as any).company?.name,
      companyLogo: (job as any).company?.logoUrl,
    }));

    return { jobs: formattedJobs, total };
  }

  public static async getJobBySlug(slug: string) {
    const job = await GetJobRepository.findBySlug(slug);
    if (!job) {
      throw new CustomError("Job not found", 404);
    }
    return job;
  }
}
