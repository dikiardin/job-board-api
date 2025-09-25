// import { prisma } from "../../config/prisma";

// export class ApplicationRepository {
//   static async createApplication(params: { userId: number; jobId: number; cvFile: string; expectedSalary?: number }) {
//     return prisma.application.create({
//       data: {
//         userId: params.userId,
//         jobId: params.jobId,
//         cvFile: params.cvFile,
//         expectedSalary: params.expectedSalary ?? null,
//       },
//     });
//   }

//   static async getPreselectionTestByJob(jobId: number) {
//     return prisma.preselectionTest.findUnique({ where: { jobId }, include: { results: true } });
//   }

//   static async getPreselectionResult(userId: number, testId: number) {
//     return prisma.preselectionResult.findUnique({ where: { userId_testId: { userId, testId } } });
//   }

//   static async getApplicationWithOwnership(applicationId: number) {
//     return prisma.application.findUnique({
//       where: { id: applicationId },
//       include: {
//         job: { include: { company: true } },
//         user: true,
//       },
//     });
//   }

//   static async updateApplicationStatus(applicationId: number, status: any, reviewNote?: string | null) {
//     return prisma.application.update({
//       where: { id: applicationId },
//       data: { status, reviewNote: reviewNote ?? null },
//     });
//   }
// }


import { prisma } from "../../config/prisma";

export class ApplicationRepo {
  static async createApplication(data: {
    userId: number;
    jobId: number;
    cvFile: string;
    expectedSalary?: number;
  }) {
    return prisma.application.create({
      data: {
        userId: data.userId,
        jobId: data.jobId,
        cvFile: data.cvFile,
        expectedSalary: typeof data.expectedSalary === "number" ? data.expectedSalary : null,
      },
    });
  }
  
  static async findExisting(userId: number, jobId: number) {
    return prisma.application.findFirst({
      where: { userId, jobId },
    });
  }
  static async getApplicationWithOwnership(applicationId: number) {
    return prisma.application.findUnique({
      where: { id: applicationId },
      include: {
        job: { include: { company: true } },
        user: true,
      },
    });
  }

  static async updateApplicationStatus(applicationId: number, status: any, reviewNote?: string | null) {
    return prisma.application.update({
      where: { id: applicationId },
      data: { status, reviewNote: reviewNote ?? null },
    });
  }
}