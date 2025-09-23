"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateCompanyService = void 0;
const createCompany_repository_1 = require("../../repositories/company/createCompany.repository");
const customError_1 = require("../../utils/customError");
class CreateCompanyService {
    static async createCompanyForAdmin(adminId, name, email) {
        const existing = await createCompany_repository_1.CreateCompanyRepo.findByAdminId(adminId);
        if (existing) {
            throw new customError_1.CustomError("This admin already manages a company", 400);
        }
        return createCompany_repository_1.CreateCompanyRepo.createCompany({
            name,
            email,
            adminId,
        });
    }
}
exports.CreateCompanyService = CreateCompanyService;
//# sourceMappingURL=createCompany.service.js.map