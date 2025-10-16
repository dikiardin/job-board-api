"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CVGenerationService = void 0;
const pdf_service_1 = require("../pdf/pdf.service");
const cv_repository_1 = require("../../../repositories/cv/cv.repository");
const cv_data_service_1 = require("./cv.data.service");
class CVGenerationService {
    // Generate new CV
    static async generateCV(userId, templateType = "ats", additionalInfo) {
        const user = await cv_data_service_1.CVDataService.getUserData(userId);
        const cvData = cv_data_service_1.CVDataService.transformUserDataToCVData(user, additionalInfo);
        // Generate PDF using PDF service
        const fileUrl = await pdf_service_1.pdfService.generatePDF(cvData, templateType);
        // Save CV record
        const cvCreateData = {
            userId,
            templateUsed: templateType,
            additionalInfo: additionalInfo || {},
            fileUrl,
        };
        const savedCV = await cv_repository_1.CVRepo.create(cvCreateData);
        return {
            cvId: savedCV.id,
            fileUrl: savedCV.fileUrl,
            cvData,
            templateType,
        };
    }
    // Update existing CV
    static async updateCV(cvId, userId, templateType = "ats", additionalInfo) {
        // Check if CV exists and belongs to user
        const existingCV = await cv_repository_1.CVRepo.findByIdAndUserId(cvId, userId);
        if (!existingCV) {
            throw new Error("CV not found or access denied");
        }
        const user = await cv_data_service_1.CVDataService.getUserData(userId);
        const cvData = cv_data_service_1.CVDataService.transformUserDataToCVData(user, additionalInfo);
        // Generate updated PDF
        const fileUrl = await pdf_service_1.pdfService.generatePDF(cvData, templateType);
        // Update CV record
        const updatedCV = await cv_repository_1.CVRepo.updateById(cvId, {
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
exports.CVGenerationService = CVGenerationService;
