import { prisma } from "../../config/prisma";

export class CreateCompanyRepo {
  public static async createCompany(data: {
    name: string;
    email: string;
    description?: string;
    website?: string;
    locationCity?: string;
    locationProvince?: string;
    address?: string;
    logoUrl?: string;
    bannerUrl?: string;
    socials?: any;
    ownerAdminId: number;
  }) {
    return prisma.company.create({ data });
  }

  public static async findByAdminId(ownerAdminId: number) {
    return prisma.company.findUnique({ where: { ownerAdminId } });
  }
}
