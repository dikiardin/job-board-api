"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetCompanyController = void 0;
const getCompany_service_1 = require("../../services/company/getCompany.service");
class GetCompanyController {
    static async getAllCompanies(req, res, next) {
        try {
            const companies = await getCompany_service_1.GetCompanyService.getAllCompanies();
            res.status(200).json({
                message: "Companies fetched successfully",
                data: companies,
            });
        }
        catch (err) {
            next(err);
        }
    }
    static async getCompanyById(req, res, next) {
        try {
            const companyId = parseInt(req.params.companyId, 10);
            if (isNaN(companyId)) {
                return res.status(400).json({ message: "Invalid company id" });
            }
            const company = await getCompany_service_1.GetCompanyService.getCompanyById(companyId);
            if (!company) {
                return res.status(404).json({ message: "Company not found" });
            }
            res.status(200).json({
                message: "Company details fetched successfully",
                data: company,
            });
        }
        catch (err) {
            next(err);
        }
    }
}
exports.GetCompanyController = GetCompanyController;
//# sourceMappingURL=getCompany.controller.js.map