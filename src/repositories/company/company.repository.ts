import { prisma } from "../../config/prisma"; 

export class CompanyRepo {
  static async findByAdminId(adminId: number) {
    return prisma.company.findFirst({
      where: { adminId }, 
    });
  }

  static async updateCompany(companyId: string | number, data: Partial<{ email: string; name: string; location: string; description: string; website: string }>) {
    const id = typeof companyId === 'string' ? Number(companyId) : companyId;
    return prisma.company.update({
      where: { id },
      data,
    });
  }
}
