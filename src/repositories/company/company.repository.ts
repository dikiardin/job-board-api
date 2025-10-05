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
      email: string;
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
        ...(data.name !== undefined && { name: data.name }),
        ...(data.email !== undefined && { email: data.email }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.locationCity !== undefined && { locationCity: data.locationCity }),
        ...(data.locationProvince !== undefined && { locationProvince: data.locationProvince }),
        ...(data.website !== undefined && { website: data.website }),
        ...(data.socials !== undefined && { socials: data.socials as any }),
        ...(data.bannerUrl !== undefined && { bannerUrl: data.bannerUrl }),
        ...(data.logoUrl !== undefined && { logoUrl: data.logoUrl }),
      },
    });
  }
}
