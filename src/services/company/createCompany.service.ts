import { CreateCompanyRepo } from "../../repositories/company/createCompany.repository";
import { CustomError } from "../../utils/customError";

export class CreateCompanyService {
  public static async createCompanyForAdmin(
    ownerAdminId: number,
    name: string,
    email: string,
    description?: string,
    website?: string,
    locationCity?: string,
    locationProvince?: string
  ) {
    const existing = await CreateCompanyRepo.findByAdminId(ownerAdminId);
    if (existing) {
      throw new CustomError("This admin already manages a company", 400);
    }

    const companyData: any = {
      name,
      email,
      ownerAdminId,
    };

    if (description) companyData.description = description;
    if (website) companyData.website = website;
    if (locationCity) companyData.locationCity = locationCity;
    if (locationProvince) companyData.locationProvince = locationProvince;

    return CreateCompanyRepo.createCompany(companyData);
  }
}