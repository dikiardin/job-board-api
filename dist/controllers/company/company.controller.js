"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompanyController = void 0;
const createCompany_repository_1 = require("../../repositories/company/createCompany.repository");
class CompanyController {
    static async getCompanyByAdmin(req, res, next) {
        try {
            // Get adminId from decoded token
            const adminId = parseInt(res.locals.decrypt?.userId);
            console.log("Admin ID from token:", adminId);
            if (!adminId) {
                return res.status(401).json({ message: "Admin ID not found in token" });
            }
            const company = await createCompany_repository_1.CreateCompanyRepo.findByAdminId(adminId);
            console.log("Found company:", company);
            if (!company) {
                return res.status(404).json({ message: "Company not found for this admin" });
            }
            res.status(200).json(company);
        }
        catch (error) {
            console.error("Error in getCompanyByAdmin:", error);
            next(error);
        }
    }
}
exports.CompanyController = CompanyController;
//# sourceMappingURL=company.controller.js.map