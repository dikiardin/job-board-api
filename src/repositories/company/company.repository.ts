import { prisma } from "../../config/prisma";

export class CompanyRepo {
  static async findByAdminId(adminId: number) {
    return prisma.company.findFirst({
      where: { ownerAdminId: adminId },
    });
  }

  static async updateCompany(
    companyId: string | number,
    data: Partial<{
      name: string;
      description: string;
      locationCity: string;
      locationProvince: string;
      website: string;
      socials: unknown;
      bannerUrl: string | null;
      logoUrl: string | null;
    }>
  ) {
    const id = typeof companyId === "string" ? Number(companyId) : companyId;
    return prisma.company.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        locationCity: data.locationCity,
        locationProvince: data.locationProvince,
        website: data.website,
        socials: data.socials as any,
        bannerUrl: data.bannerUrl ?? undefined,
        logoUrl: data.logoUrl ?? undefined,
      },
    });
  }
}
