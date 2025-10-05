import { Request, Response, NextFunction } from "express";
import { GetCompanyService } from "../../services/company/getCompany.service";

export class GetCompanyController {
  public static async getAllCompanies(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { page = 1, limit = 9, keyword, city } = req.query;

      const companies = await GetCompanyService.getAllCompanies({
        page: Number(page),
        limit: Number(limit),
        keyword: keyword as string,
        city: city as string,
      });

      res.status(200).json({
        message: "Companies fetched successfully",
        data: companies.data,
        total: companies.total,
        page: Number(page),
        limit: Number(limit),
      });
    } catch (err) {
      next(err);
    }
  }

  public static async getCompanyBySlug(
    req: Request<{ slug: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { slug } = req.params;

      const company = await GetCompanyService.getCompanyBySlug(slug);
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
