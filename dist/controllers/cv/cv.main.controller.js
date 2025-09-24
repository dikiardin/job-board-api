"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cvMainController = exports.CVMainController = void 0;
const cv_service_1 = require("../../services/cv/cv.service");
class CVMainController {
    // Generate CV from user profile
    async generateCV(req, res) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                return res.status(401).json({ message: "Unauthorized" });
            }
            const { templateType = "ats", additionalInfo } = req.body;
            const cv = await cv_service_1.cvService.generateCV(userId, templateType, additionalInfo);
            res.status(201).json({
                message: "CV generated successfully",
                data: cv,
            });
        }
        catch (error) {
            console.error("Generate CV error:", error);
            res.status(500).json({
                message: "Failed to generate CV",
                error: error instanceof Error ? error.message : "Unknown error",
            });
        }
    }
    // Get user's generated CVs
    async getUserCVs(req, res) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                return res.status(401).json({ message: "Unauthorized" });
            }
            const cvs = await cv_service_1.cvService.getUserCVs(userId);
            res.status(200).json({
                message: "CVs retrieved successfully",
                data: cvs,
            });
        }
        catch (error) {
            console.error("Get user CVs error:", error);
            res.status(500).json({
                message: "Failed to retrieve CVs",
                error: error instanceof Error ? error.message : "Unknown error",
            });
        }
    }
    // Get specific CV by ID
    async getCVById(req, res) {
        try {
            const userId = req.user?.id;
            const cvId = parseInt(req.params.id);
            if (!userId) {
                return res.status(401).json({ message: "Unauthorized" });
            }
            if (isNaN(cvId)) {
                return res.status(400).json({ message: "Invalid CV ID" });
            }
            const cv = await cv_service_1.cvService.getCVById(cvId, userId);
            if (!cv) {
                return res.status(404).json({ message: "CV not found" });
            }
            res.status(200).json({
                message: "CV retrieved successfully",
                data: cv,
            });
        }
        catch (error) {
            console.error("Get CV by ID error:", error);
            res.status(500).json({
                message: "Failed to retrieve CV",
                error: error instanceof Error ? error.message : "Unknown error",
            });
        }
    }
    // Delete CV
    async deleteCV(req, res) {
        try {
            const userId = req.user?.id;
            const cvId = parseInt(req.params.id);
            if (!userId) {
                return res.status(401).json({ message: "Unauthorized" });
            }
            if (isNaN(cvId)) {
                return res.status(400).json({ message: "Invalid CV ID" });
            }
            await cv_service_1.cvService.deleteCV(cvId, userId);
            res.status(200).json({
                message: "CV deleted successfully",
            });
        }
        catch (error) {
            console.error("Delete CV error:", error);
            res.status(500).json({
                message: "Failed to delete CV",
                error: error instanceof Error ? error.message : "Unknown error",
            });
        }
    }
}
exports.CVMainController = CVMainController;
exports.cvMainController = new CVMainController();
//# sourceMappingURL=cv.main.controller.js.map