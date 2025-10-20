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
        try {
          // Auto-provision a default company for this admin to avoid broken admin flows
          const admin = await UserRepo.findById(adminId);
          const defaultName = admin?.name ? `${admin.name} Company` : `Company ${adminId}`;
          const defaultEmail = admin?.email || `admin${adminId}@company.com`;
          
          company = await CreateCompanyRepo.createCompany({
            name: defaultName,
            email: defaultEmail,
            ownerAdminId: adminId,
            description: "Auto-created company",
            website: "",
            locationCity: "Jakarta",
            locationProvince: "DKI Jakarta",
            address: "Jakarta, Indonesia",
          });
        } catch (createError) {
          console.error("Error creating default company:", createError);
          // If we can't create a company, return 404 instead of 500
          return res.status(404).json({ 
            message: "Company not found. Please complete your profile to create a company.",
            needsProfileCompletion: true 
          });
        }
      }

      res.status(200).json(company);
    } catch (error) {
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
