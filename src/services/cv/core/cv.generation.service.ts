import { prisma } from "../../../config/prisma";
import { pdfService } from "../pdf/pdf.service";
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

    // Generate PDF using PDF service
    const fileUrl = await pdfService.generatePDF(cvData, templateType);

    // Save CV record
    const cvCreateData = {
      userId,
      templateUsed: templateType,
      additionalInfo: additionalInfo || {},
      fileUrl,
    };
    
    const savedCV = await CVRepo.create(cvCreateData);

    return {
      cvId: savedCV.id,
      fileUrl: savedCV.fileUrl,
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
    // Check if CV exists and belongs to user
    const existingCV = await CVRepo.findByIdAndUserId(cvId, userId);
    if (!existingCV) {
      throw new Error("CV not found or access denied");
    }

    const user = await CVDataService.getUserData(userId);
    const cvData = CVDataService.transformUserDataToCVData(user, additionalInfo);

    // Generate updated PDF
    const fileUrl = await pdfService.generatePDF(cvData, templateType);

    // Update CV record
    const updatedCV = await CVRepo.updateById(cvId, {
      templateUsed: templateType,
      additionalInfo: additionalInfo || {},
      fileUrl,
    });

    return {
      cvId: updatedCV.id,
      fileUrl: updatedCV.fileUrl,
      cvData,
      templateType,
    };
  }
}
