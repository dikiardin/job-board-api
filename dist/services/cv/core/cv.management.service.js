"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cvManagementService = exports.CVManagementService = void 0;
const uploadBuffer_1 = require("../../../utils/uploadBuffer");
const cv_repository_1 = require("../../../repositories/cv/cv.repository");
class CVManagementService {
    // Get user's generated CVs
    async getUserCVs(userId) {
        return await cv_repository_1.CVRepo.findByUserId(userId);
    }
    // Get specific CV by ID
    async getCVById(cvId, userId) {
        const cv = await cv_repository_1.CVRepo.findByIdAndUserId(cvId, userId);
        if (cv) {
            // Create API-based download URLs
            const apiDownloadUrl = `/cv/${cv.id}/download`; // Auth required
            const publicDownloadUrl = `/cv/public/${cv.id}/CV_${cv.id}.pdf`; // No auth required
            const publicDownloadDefault = `/cv/public/${cv.id}`; // Default filename
            return {
                ...cv,
                downloadUrl: apiDownloadUrl, // API endpoint (auth required)
                publicUrl: publicDownloadUrl, // Public download URL (no auth)
                publicUrlDefault: publicDownloadDefault, // Public URL with default filename
                originalUrl: cv.fileUrl // Original Cloudinary URL
            };
        }
        return cv;
    }
    // Delete CV
    async deleteCV(cvId, userId) {
        const cv = await cv_repository_1.CVRepo.findByIdAndUserId(cvId, userId);
        if (!cv) {
            throw new Error('CV not found');
        }
        // Delete from Cloudinary
        try {
            await (0, uploadBuffer_1.deleteFromCloudinary)(cv.fileUrl);
        }
        catch (error) {
            console.error('Failed to delete from Cloudinary:', error);
            // Continue with database deletion even if Cloudinary deletion fails
        }
        // Delete from database using repository
        await cv_repository_1.CVRepo.deleteByIdAndUserId(cvId, userId);
        return { message: 'CV deleted successfully' };
    }
    // Get available CV templates
    getAvailableTemplates() {
        return [
            {
                id: 'ats',
                name: 'ATS-Friendly Template',
                description: 'Clean, professional template optimized for Applicant Tracking Systems',
                preview: '/templates/ats-preview.png'
            }
        ];
    }
}
exports.CVManagementService = CVManagementService;
exports.cvManagementService = new CVManagementService();
