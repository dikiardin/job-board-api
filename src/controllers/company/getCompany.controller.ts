import { Request, Response, NextFunction } from "express";
import { GetCompanyService } from "../../services/company/getCompany.service";

export class GetCompanyController {
  public static async getAllCompanies(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const companies = await GetCompanyService.getAllCompanies();
      res.status(200).json({
        message: "Companies fetched successfully",
        data: companies,
      });
    } catch (err) {
      next(err);
    }
  }

  public static async getCompanyById(
    req: Request<{ companyId: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const companyId = parseInt(req.params.companyId, 10);

      if (isNaN(companyId)) {
        return res.status(400).json({ message: "Invalid company id" });
      }

      const company = await GetCompanyService.getCompanyById(companyId);
      if (!company) {
        return res.status(404).json({ message: "Company not found" });
      }

      res.status(200).json({
        message: "Company details fetched successfully",
        data: company,
      });
    } catch (err) {
      next(err);
    }
  }
}
