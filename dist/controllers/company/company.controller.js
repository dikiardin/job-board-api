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
                try {
                    // Auto-provision a default company for this admin to avoid broken admin flows
                    const admin = await user_repository_1.UserRepo.findById(adminId);
                    const defaultName = admin?.name ? `${admin.name} Company` : `Company ${adminId}`;
                    const defaultEmail = admin?.email || `admin${adminId}@company.com`;
                    company = await createCompany_repository_1.CreateCompanyRepo.createCompany({
                        name: defaultName,
                        email: defaultEmail,
                        ownerAdminId: adminId,
                        description: "Auto-created company",
                        website: "",
                        locationCity: "Jakarta",
                        locationProvince: "DKI Jakarta",
                        address: "Jakarta, Indonesia",
                    });
                }
                catch (createError) {
                    console.error("Error creating default company:", createError);
                    // If we can't create a company, return 404 instead of 500
                    return res.status(404).json({
                        message: "Company not found. Please complete your profile to create a company.",
                        needsProfileCompletion: true
                    });
                }
            }
            res.status(200).json(company);
        }
        catch (error) {
            console.error("Error in getCompanyByAdmin:", error);
            // Return a more user-friendly error instead of 500
            if (error instanceof Error) {
                return res.status(500).json({
                    message: "Unable to load company information. Please try again later.",
                    error: process.env.NODE_ENV === 'development' ? error.message : undefined
                });
            }
            next(error);
        }
    }
}
exports.CompanyController = CompanyController;
