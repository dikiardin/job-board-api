import { prisma } from "../../config/prisma";

export class SkillAssessmentResultsCertificateRepository {
  // Verify certificate by code
  public static async verifyCertificate(certificateCode: string) {
    return await prisma.skillResult.findFirst({
      where: { certificateCode },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
        assessment: {
          select: { id: true, title: true, description: true },
        },
      },
    });
  }

  // Get user's certificates
  public static async getUserCertificates(
    userId: number,
    page: number = 1,
    limit: number = 10
  ) {
    const skip = (page - 1) * limit;

    const [certificates, total] = await Promise.all([
      prisma.skillResult.findMany({
        where: {
          userId,
          certificateCode: { not: null },
        },
        skip,
        take: limit,
        include: {
          assessment: {
            select: { id: true, title: true, description: true },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.skillResult.count({
        where: {
          userId,
          certificateCode: { not: null },
        },
      }),
    ]);

    return {
      certificates,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // Get certificate by code
  public static async getCertificateByCode(certificateCode: string) {
    return await prisma.skillResult.findFirst({
      where: { certificateCode },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
        assessment: {
          select: { id: true, title: true, description: true },
        },
      },
    });
  }
}
