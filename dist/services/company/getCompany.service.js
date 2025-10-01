"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetCompanyService = void 0;
const getCompany_repository_1 = require("../../repositories/company/getCompany.repository");
class GetCompanyService {
    static async getAllCompanies() {
        return getCompany_repository_1.GetCompanyRepository.getAllCompanies();
    }
    static async getCompanyById(companyId) {
        return getCompany_repository_1.GetCompanyRepository.getCompanyById(companyId);
    }
}
exports.GetCompanyService = GetCompanyService;
//# sourceMappingURL=getCompany.service.js.map