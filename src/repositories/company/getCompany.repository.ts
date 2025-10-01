import { prisma } from "../../config/prisma";

export class GetCompanyRepository {
  public static async getAllCompanies() {
    return prisma.company.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        location: true,
        city:true,
        description: true,
        website: true,
        logo: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            jobs: {
              where: { isPublished: true },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  public static async getCompanyById(companyId: number) {
    return prisma.company.findUnique({
      where: { id: companyId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        location: true,
        description: true,
        website: true,
        logo: true,
        createdAt: true,
        updatedAt: true,
        jobs: {
          where: { isPublished: true },
          select: {
            id: true,
            title: true,
            city: true,
            category: true,
            salaryMin: true,
            salaryMax: true,
            tags: true,
            banner: true,
            deadline: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });
  }
}
