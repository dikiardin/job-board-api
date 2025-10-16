"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateCompanyService = void 0;
const createCompany_repository_1 = require("../../repositories/company/createCompany.repository");
const customError_1 = require("../../utils/customError");
class CreateCompanyService {
    static async createCompanyForAdmin(ownerAdminId, name, email, description, website, locationCity, locationProvince) {
        const existing = await createCompany_repository_1.CreateCompanyRepo.findByAdminId(ownerAdminId);
        if (existing) {
            throw new customError_1.CustomError("This admin already manages a company", 400);
        }
        const companyData = {
            name,
            email,
            ownerAdminId,
        };
        if (description)
            companyData.description = description;
        if (website)
            companyData.website = website;
        if (locationCity)
            companyData.locationCity = locationCity;
        if (locationProvince)
            companyData.locationProvince = locationProvince;
        return createCompany_repository_1.CreateCompanyRepo.createCompany(companyData);
    }
}
exports.CreateCompanyService = CreateCompanyService;
