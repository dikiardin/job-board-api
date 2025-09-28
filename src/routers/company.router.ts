import { Router } from "express";
import { CompanyController } from "../controllers/company/company.controller";
import { verifyToken } from "../middlewares/verifyToken";

class CompanyRouter {
  private route: Router;
  private companyController: typeof CompanyController;

  constructor() {
    this.route = Router();
    this.companyController = CompanyController;
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.route.get(
      "/admin",
      verifyToken,
      this.companyController.getCompanyByAdmin
    );
  }

  public getRouter(): Router {
    return this.route;
  }
}

export default CompanyRouter;
