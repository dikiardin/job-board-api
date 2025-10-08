import { GetCompanyRepository } from "../../repositories/company/getCompany.repository";

interface GetAllCompaniesParams {
  page: number;
  limit: number;
  keyword?: string;
  city?: string;
}

type SortField = "name" | "jobsCount";
type SortOrder = "asc" | "desc";

export class GetCompanyService {
  public static async getAllCompanies(
    params: GetAllCompaniesParams & { sort?: SortField; order?: SortOrder }
  ) {
    return GetCompanyRepository.getAllCompanies(params);
  }

  public static async getCompanyBySlug(slug: string) {
    return GetCompanyRepository.getCompanyBySlug(slug);
  }
}
