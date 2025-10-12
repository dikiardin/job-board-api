import { prisma } from "../../config/prisma";

export class AssessmentResultsCertificateRepository {
  // Verify certificate by code
  public static async verifyCertificate(certificateCode: string) {
    return await prisma.skillResult.findFirst({
      where: {
        certificateCode,
        isPassed: true, // Only return passed certificates
        certificateUrl: { not: null }, // Only return certificates with URL
      },
      include: {
        user: { select: { id: true, name: true, email: true } },
        assessment: {
          select: { id: true, title: true, description: true, category: true },
        },
      },
    });
  }

  // Get user's certificates
  public static async getUserCertificates(
    userId: number,
    page?: number,
    limit?: number
  ) {
    const query: any = {
      where: { userId, certificateCode: { not: null } },
      include: {
        assessment: { select: { id: true, title: true, description: true } },
      },
      orderBy: { createdAt: "desc" },
    };

    if (page && limit) {
      query.skip = (page - 1) * limit;
      query.take = limit;
    }

    const [certificates, total] = await Promise.all([
      prisma.skillResult.findMany(query),
      prisma.skillResult.count({
        where: { userId, certificateCode: { not: null } },
      }),
    ]);

    return {
      certificates,
      pagination:
        page && limit
          ? { page, limit, total, totalPages: Math.ceil(total / limit) }
          : null,
    };
  }

  // Get certificate by code
  public static async getCertificateByCode(certificateCode: string) {
    return await prisma.skillResult.findFirst({
      where: { certificateCode },
      include: {
        user: { select: { id: true, name: true, email: true } },
        assessment: { select: { id: true, title: true, description: true } },
      },
    });
  }
}
