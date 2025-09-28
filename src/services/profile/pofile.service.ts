import { ProfileRepository } from "../../repositories/profile/profile.repository";

export class ProfileService {
  static async getUserProfile(userId: number) {
    const user = await ProfileRepository.getUserProfile(userId);
    if (!user) throw new Error("User not found");
    return user;
  }

  static async getCompanyProfile(adminId: number) {
    const company = await ProfileRepository.getCompanyProfile(adminId);
    if (!company) throw new Error("Company not found");
    return company;
  }
}