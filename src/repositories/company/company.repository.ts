import { prisma } from "../../config/prisma"; 

export class CompanyRepo {
  static async findByAdminId(adminId: number) {
    return prisma.company.findFirst({
      where: { adminId }, 
    });
  }

  static async updateCompany(companyId: number, data: Partial<{ email: string; name: string; location: string; description: string; website: string }>) {
    return prisma.company.update({
      where: { id: companyId },
      data,
    });
  }
}