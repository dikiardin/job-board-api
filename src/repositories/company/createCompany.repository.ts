import { prisma } from "../../config/prisma";

export class CreateCompanyRepo {
  public static async createCompany(data: {
    name: string;
    email?: string;
    phone?: string;
    location?: string;
    description?: string;
    website?: string;
    logo?: string;
    adminId: number;
  }) {
    return prisma.company.create({ data });
  }

  public static async findByAdminId(adminId: number) {
    return prisma.company.findUnique({ where: { adminId } });
  }
}