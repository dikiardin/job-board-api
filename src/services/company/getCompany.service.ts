import { GetCompanyRepository } from "../../repositories/company/getCompany.repository";

export class GetCompanyService {
  public static async getAllCompanies() {
    return GetCompanyRepository.getAllCompanies();
  }

  public static async getCompanyById(companyId: number) {
    return GetCompanyRepository.getCompanyById(companyId);
  }
}
