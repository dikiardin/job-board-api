import { CVGenerationService } from "./cv.generation.service";
import { CVAdditionalInfo } from "./cv.types";

// Re-export types for backward compatibility
export { CVData, CVAdditionalInfo, CVTemplate } from "./cv.types";

class CVService {
  // Generate CV from user profile
  async generateCV(
    userId: number,
    templateType: string = "ats",
    additionalInfo?: CVAdditionalInfo
  ) {
    return await CVGenerationService.generateCV(userId, templateType, additionalInfo);
  }

  // Update existing CV
  async updateCV(
    cvId: number,
    userId: number,
    templateType: string = "ats",
    additionalInfo?: CVAdditionalInfo
  ) {
    return await CVGenerationService.updateCV(cvId, userId, templateType, additionalInfo);
  }

  // Delegate to management service
  async getUserCVs(userId: number) {
    const { cvManagementService } = await import("./cv.management.service");
    return cvManagementService.getUserCVs(userId);
  }

  async getCVById(cvId: number, userId: number) {
    const { cvManagementService } = await import("./cv.management.service");
    return cvManagementService.getCVById(cvId, userId);
  }

  async deleteCV(cvId: number, userId: number) {
    const { cvManagementService } = await import("./cv.management.service");
    return cvManagementService.deleteCV(cvId, userId);
  }

  getAvailableTemplates() {
    return [
      {
        id: "ats",
        name: "ATS Friendly",
        description: "Optimized for Applicant Tracking Systems",
        isATS: true,
      },
      {
        id: "modern",
        name: "Modern Design",
        description: "Clean and contemporary layout",
        isATS: false,
      },
      {
        id: "creative",
        name: "Creative",
        description: "Eye-catching design for creative roles",
        isATS: false,
      },
    ];
  }
}

export const cvService = new CVService();
