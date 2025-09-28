import { NextFunction, Request, Response } from "express";
import { CreateCompanyRepo } from "../../repositories/company/createCompany.repository";

export class CompanyController {
  public static async getCompanyByAdmin(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      // Get adminId from decoded token
      const adminId = parseInt(res.locals.decrypt?.userId);
      
      console.log("Admin ID from token:", adminId);
      
      if (!adminId) {
        return res.status(401).json({ message: "Admin ID not found in token" });
      }
      
      const company = await CreateCompanyRepo.findByAdminId(adminId);
      
      console.log("Found company:", company);
      
      if (!company) {
        return res.status(404).json({ message: "Company not found for this admin" });
      }

      res.status(200).json(company);
    } catch (error) {
      console.error("Error in getCompanyByAdmin:", error);
      next(error);
    }
  }
}
