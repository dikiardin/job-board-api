"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const company_controller_1 = require("../controllers/company/company.controller");
const verifyToken_1 = require("../middlewares/verifyToken");
class CompanyRouter {
    constructor() {
        this.route = (0, express_1.Router)();
        this.companyController = company_controller_1.CompanyController;
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.route.get("/admin", verifyToken_1.verifyToken, this.companyController.getCompanyByAdmin);
    }
    getRouter() {
        return this.route;
    }
}
exports.default = CompanyRouter;
//# sourceMappingURL=company.router.js.map