import { CreateCompanyRepo } from "../../repositories/company/createCompany.repository";
import { CustomError } from "../../utils/customError";

export class CreateCompanyService {
  public static async createCompanyForAdmin(
    adminId: number,
    name: string,
    email: string
  ) {
    const existing = await CreateCompanyRepo.findByAdminId(adminId);
    if (existing) {
      throw new CustomError("This admin already manages a company", 400);
    }

    return CreateCompanyRepo.createCompany({
      name,
      email,
      adminId,
    });
  }
}