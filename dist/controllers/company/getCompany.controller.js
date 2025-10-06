"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetCompanyController = void 0;
const getCompany_service_1 = require("../../services/company/getCompany.service");
class GetCompanyController {
    static async getAllCompanies(req, res, next) {
        try {
            const { page = 1, limit = 9, keyword, city } = req.query;
            const companies = await getCompany_service_1.GetCompanyService.getAllCompanies({
                page: Number(page),
                limit: Number(limit),
                keyword: keyword,
                city: city,
            });
            res.status(200).json({
                message: "Companies fetched successfully",
                data: companies.data,
                total: companies.total,
                page: Number(page),
                limit: Number(limit),
            });
        }
        catch (err) {
            next(err);
        }
    }
    static async getCompanyBySlug(req, res, next) {
        try {
            const { slug } = req.params;
            const company = await getCompany_service_1.GetCompanyService.getCompanyBySlug(slug);
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