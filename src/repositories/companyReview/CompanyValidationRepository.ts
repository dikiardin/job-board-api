import { prisma } from "../../config/prisma";

export class CompanyValidationRepository {
  // Check if company exists
  public static async checkCompanyExists(companyId: number | string): Promise<boolean> {
    const id = typeof companyId === "string" ? Number(companyId) : companyId;
    
    if (isNaN(id)) {
      return false;
    }
    
    const company = await prisma.company.findUnique({
      where: { id },
      select: { id: true },
    });
    return !!company;
  }

  // Get user's employment record with a company
  public static async getUserEmployment(userId: number, companyId: number | string) {
    const cid = typeof companyId === "string" ? Number(companyId) : companyId;
    return await prisma.employment.findFirst({
      where: {
        userId,
        companyId: cid,
      },
      select: {
        id: true,
        startDate: true,
        endDate: true,
      },
    });
  }

  public static async getUserVerifiedEmployment(userId: number, companyId: number | string) {
    const cid = typeof companyId === "string" ? Number(companyId) : companyId;
    return await prisma.employment.findFirst({
      where: {
        userId,
        companyId: cid,
        isVerified: true,
      },
      select: {
        id: true,
        positionTitle: true,
        startDate: true,
        endDate: true,
        isCurrent: true,
        createdAt: true,
        company: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }
}
