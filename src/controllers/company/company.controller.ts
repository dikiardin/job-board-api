import { NextFunction, Request, Response } from "express";
import { CreateCompanyRepo } from "../../repositories/company/createCompany.repository";
import { UserRepo } from "../../repositories/user/user.repository";

export class CompanyController {
  public static async getCompanyByAdmin(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      // Get adminId from decoded token
      const adminId = parseInt(res.locals.decrypt?.userId);
      
      if (!adminId) {
        return res.status(401).json({ message: "Admin ID not found in token" });
      }
      
      let company = await CreateCompanyRepo.findByAdminId(adminId);
      
      if (!company) {
        // Auto-provision a default company for this admin to avoid broken admin flows
        const admin = await UserRepo.findById(adminId);
        const defaultName = admin?.name ? `${admin.name} Company` : `Company ${adminId}`;
        const defaultEmail = admin?.email;
        company = await CreateCompanyRepo.createCompany({
          name: defaultName,
          email: defaultEmail,
          adminId,
          city: "Jakarta" as any,
          location: "Jakarta, Indonesia",
          description: "Auto-created company",
          website: "",
        } as any);
      }

      res.status(200).json(company);
    } catch (error) {
      console.error("Error in getCompanyByAdmin:", error);
      next(error);
    }
  }
}
