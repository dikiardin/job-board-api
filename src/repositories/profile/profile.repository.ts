import { prisma } from "../../config/prisma";

export class ProfileRepository {
  static async getUserProfile(userId: number) {
    return prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        role: true,
        name: true,
        email: true,
        phone: true,
        gender: true,
        dob: true,
        education: true,
        address: true,
        city:true,
        profilePicture: true,
        emailVerifiedAt: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  static async getCompanyProfile(ownerAdminId: number) {
    return prisma.company.findUnique({
      where: { ownerAdminId },
      select: {
        id: true,
        slug: true,
        name: true,
        description: true,
        website: true,
        locationCity: true,
        locationProvince: true,
        locationCountry: true,
        address: true,
        logoUrl: true,
        bannerUrl: true,
        socials: true,
        ownerAdminId: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }
}