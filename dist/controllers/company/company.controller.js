"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompanyController = void 0;
const createCompany_repository_1 = require("../../repositories/company/createCompany.repository");
const user_repository_1 = require("../../repositories/user/user.repository");
class CompanyController {
    static async getCompanyByAdmin(req, res, next) {
        try {
            // Get adminId from decoded token
            const adminId = parseInt(res.locals.decrypt?.userId);
            if (!adminId) {
                return res.status(401).json({ message: "Admin ID not found in token" });
            }
            let company = await createCompany_repository_1.CreateCompanyRepo.findByAdminId(adminId);
            if (!company) {
                // Auto-provision a default company for this admin to avoid broken admin flows
                const admin = await user_repository_1.UserRepo.findById(adminId);
                const defaultName = admin?.name ? `${admin.name} Company` : `Company ${adminId}`;
                const defaultEmail = admin?.email;
                company = await createCompany_repository_1.CreateCompanyRepo.createCompany({
                    name: defaultName,
                    email: defaultEmail,
                    adminId,
                    city: "Jakarta",
                    location: "Jakarta, Indonesia",
                    description: "Auto-created company",
                    website: "",
                });
            }
            res.status(200).json(company);
        }
        catch (error) {
            if (process.env.NODE_ENV !== "production") {
                console.error("Error in getCompanyByAdmin:", error);
            }
            next(error);
        }
    }
}
exports.CompanyController = CompanyController;
//# sourceMappingURL=company.controller.js.map