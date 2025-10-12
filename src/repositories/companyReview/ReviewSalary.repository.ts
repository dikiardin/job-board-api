import { prisma } from "../../config/prisma";

export class ReviewSalaryRepository {
  // Get salary estimates by position for a company
  public static async getSalaryEstimates(companyId: number | string) {
    const cid = typeof companyId === "string" ? Number(companyId) : companyId;
    const salaryByPosition = (await prisma.$queryRaw`
      SELECT 
        "positionTitle" as position,
        COUNT(*) as count,
        AVG("salaryEstimateMin") as average_salary,
        MIN("salaryEstimateMin") as min_salary,
        MAX("salaryEstimateMax") as max_salary
      FROM "CompanyReview" cr
      WHERE cr."companyId" = ${cid} AND cr."salaryEstimateMin" IS NOT NULL
      GROUP BY "positionTitle"
      ORDER BY count DESC, average_salary DESC
    `) as Array<{
      position: string;
      count: bigint;
      average_salary: number;
      min_salary: number;
      max_salary: number;
    }>;

    return salaryByPosition.map((estimate) => ({
      position: estimate.position,
      count: Number(estimate.count),
      averageSalary: estimate.average_salary?.toFixed(0),
      minSalary: estimate.min_salary,
      maxSalary: estimate.max_salary,
    }));
  }
}
