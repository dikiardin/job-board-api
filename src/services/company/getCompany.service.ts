import { GetCompanyRepository } from "../../repositories/company/getCompany.repository";

interface GetAllCompaniesParams {
  page: number;
  limit: number;
  keyword?: string;
  city?: string;
}

export class GetCompanyService {
  public static async getAllCompanies(params: GetAllCompaniesParams) {
    return GetCompanyRepository.getAllCompanies(params);
  }

  public static async getCompanyById(companyId: string) {
    return GetCompanyRepository.getCompanyById(companyId);
  }
}
