import { CreateAdminRepo } from "../../repositories/company-admin/createAdmin.repository";
export class CreateAdminService {
  public static async createForNewAdmin(userId: number, companyId: number) {
    return CreateAdminRepo.createAdminForCompany(userId, companyId);
  }
}