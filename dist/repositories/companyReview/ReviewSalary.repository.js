"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewSalaryRepository = void 0;
const prisma_1 = require("../../config/prisma");
class ReviewSalaryRepository {
    // Get salary estimates by position for a company
    static async getSalaryEstimates(companyId) {
        const cid = typeof companyId === "string" ? Number(companyId) : companyId;
        const salaryByPosition = (await prisma_1.prisma.$queryRaw `
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
    `);
        return salaryByPosition.map((estimate) => ({
            position: estimate.position,
            count: Number(estimate.count),
            averageSalary: estimate.average_salary?.toFixed(0),
            minSalary: estimate.min_salary,
            maxSalary: estimate.max_salary,
        }));
    }
}
exports.ReviewSalaryRepository = ReviewSalaryRepository;
