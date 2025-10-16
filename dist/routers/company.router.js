"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const company_controller_1 = require("../controllers/company/company.controller");
const verifyToken_1 = require("../middlewares/verifyToken");
const getCompany_controller_1 = require("../controllers/company/getCompany.controller");
class CompanyRouter {
    constructor() {
        this.route = (0, express_1.Router)();
        this.companyController = company_controller_1.CompanyController;
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.route.get("/admin", verifyToken_1.verifyToken, this.companyController.getCompanyByAdmin);
        this.route.get("/all", getCompany_controller_1.GetCompanyController.getAllCompanies);
        this.route.get("/:slug", getCompany_controller_1.GetCompanyController.getCompanyBySlug);
    }
    getRouter() {
        return this.route;
    }
}
exports.default = CompanyRouter;
