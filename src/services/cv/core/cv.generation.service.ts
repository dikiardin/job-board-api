import { prisma } from "../../../config/prisma";
import { PDFService } from "../pdf/pdf.service";
import { CVRepo } from "../../../repositories/cv/cv.repository";
import { CVData, CVAdditionalInfo } from "./cv.types";
import { CVDataService } from "./cv.data.service";

export class CVGenerationService {
  // Generate new CV
  static async generateCV(
    userId: number,
    templateType: string = "ats",
    additionalInfo?: CVAdditionalInfo
  ) {
    const user = await CVDataService.getUserData(userId);
    const cvData = CVDataService.transformUserDataToCVData(user, additionalInfo);

    // Generate PDF (mock implementation)
    const pdfBuffer = Buffer.from("Mock PDF content");

    // Save CV record (mock implementation)
    const savedCV = { id: Date.now() };

    return {
      cvId: savedCV.id,
      pdfBuffer,
      cvData,
      templateType,
    };
  }

  // Update existing CV
  static async updateCV(
    cvId: number,
    userId: number,
    templateType: string = "ats",
    additionalInfo?: CVAdditionalInfo
  ) {
    // Mock CV existence check
    if (!cvId || !userId) {
      throw new Error("CV not found or access denied");
    }

    const user = await CVDataService.getUserData(userId);
    const cvData = CVDataService.transformUserDataToCVData(user, additionalInfo);

    // Generate updated PDF (mock implementation)
    const pdfBuffer = Buffer.from("Mock updated PDF content");

    return {
      cvId,
      pdfBuffer,
      cvData,
      templateType,
    };
  }
}
