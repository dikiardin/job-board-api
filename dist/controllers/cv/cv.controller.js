"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cvController = exports.CVController = void 0;
const cv_service_1 = require("../../services/cv/cv.service");
const prisma_1 = require("../../config/prisma");
class CVController {
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
    // Download CV
    async downloadCV(req, res) {
        try {
            const cvIdParam = req.params.id;
            if (!cvIdParam) {
                return res.status(400).json({ message: "CV ID is required" });
            }
            const cvId = parseInt(cvIdParam);
            const userId = req.user?.id;
            if (!userId) {
                return res.status(401).json({ message: "Unauthorized" });
            }
            const cv = await cv_service_1.cvService.getCVById(cvId, userId);
            if (!cv) {
                return res.status(404).json({ message: "CV not found" });
            }
            // Debug: Try different URL variations
            console.log("Original fileUrl:", cv.fileUrl);
            // Try original URL first
            let response = await fetch(cv.fileUrl);
            console.log("First attempt response:", response.status, response.statusText);
            if (!response.ok) {
                // Try without .pdf extension
                const urlWithoutPdf = cv.fileUrl.replace(".pdf", "");
                console.log("Trying URL without .pdf:", urlWithoutPdf);
                response = await fetch(urlWithoutPdf);
                console.log("Second attempt response:", response.status, response.statusText);
            }
            if (!response.ok) {
                console.error("All fetch attempts failed:", response.status, response.statusText);
                // As fallback, redirect to original Cloudinary URL
                console.log("Redirecting to Cloudinary URL directly");
                return res.redirect(cv.fileUrl);
            }
            const buffer = await response.arrayBuffer();
            console.log("PDF buffer size:", buffer.byteLength);
            // Validate PDF buffer
            const pdfBuffer = Buffer.from(buffer);
            const pdfHeader = pdfBuffer.toString("ascii", 0, 4);
            console.log("PDF header:", pdfHeader);
            if (!pdfHeader.startsWith("%PDF")) {
                console.error("Invalid PDF file - missing PDF header");
                return res.status(500).json({ message: "Invalid PDF file" });
            }
            // Set proper headers for PDF download
            res.setHeader("Content-Type", "application/pdf");
            res.setHeader("Content-Disposition", `attachment; filename="CV_${cv.id}.pdf"`);
            res.setHeader("Content-Length", buffer.byteLength.toString());
            res.setHeader("Cache-Control", "no-cache");
            // Send the PDF buffer
            res.send(pdfBuffer);
        }
        catch (error) {
            console.error("Download CV error:", error);
            res.status(500).json({
                message: "Failed to download CV",
                error: error instanceof Error ? error.message : "Unknown error",
            });
        }
    }
    // Public download CV (with proper filename)
    async publicDownloadCV(req, res) {
        try {
            const cvIdParam = req.params.id;
            if (!cvIdParam) {
                return res.status(400).json({ message: "CV ID is required" });
            }
            const cvId = parseInt(cvIdParam);
            // Use filename from params or default to CV_{id}.pdf
            const filename = req.params.filename || `CV_${cvId}.pdf`;
            if (!cvId) {
                return res.status(400).json({ message: "CV ID is required" });
            }
            // Get CV without user restriction for public access
            const cv = await prisma_1.prisma.generatedCV.findFirst({
                where: { id: cvId },
            });
            if (!cv) {
                return res.status(404).json({ message: "CV not found" });
            }
            // Fetch PDF from Cloudinary
            console.log("Public download - Fetching PDF from:", cv.fileUrl);
            const response = await fetch(cv.fileUrl);
            if (!response.ok) {
                console.error("Failed to fetch PDF:", response.status, response.statusText);
                return res.status(404).json({ message: "CV file not found" });
            }
            const buffer = await response.arrayBuffer();
            const pdfBuffer = Buffer.from(buffer);
            // Set proper headers for PDF download with custom filename
            res.setHeader("Content-Type", "application/pdf");
            res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
            res.setHeader("Content-Length", buffer.byteLength.toString());
            res.setHeader("Cache-Control", "public, max-age=3600"); // Cache for 1 hour
            // Send the PDF buffer
            res.send(pdfBuffer);
        }
        catch (error) {
            console.error("Public download CV error:", error);
            res.status(500).json({
                message: "Failed to download CV",
                error: error instanceof Error ? error.message : "Unknown error",
            });
        }
    }
    // Get available CV templates (filtered by subscription)
    async getTemplates(req, res) {
        try {
            const allTemplates = cv_service_1.cvService.getAvailableTemplates();
            const userLimits = req.subscription?.limits;
            // Filter templates based on subscription
            const availableTemplates = allTemplates.filter((template) => userLimits?.templatesAccess.includes(template.id));
            res.status(200).json({
                message: "Templates retrieved successfully",
                data: availableTemplates,
                subscription: {
                    plan: req.subscription?.plan.planName,
                    availableTemplates: userLimits?.templatesAccess,
                    cvLimit: userLimits?.cvGenerationLimit === -1
                        ? "Unlimited"
                        : userLimits?.cvGenerationLimit,
                },
            });
        }
        catch (error) {
            console.error("Get templates error:", error);
            res.status(500).json({
                message: "Failed to retrieve templates",
                error: error instanceof Error ? error.message : "Unknown error",
            });
        }
    }
}
exports.CVController = CVController;
exports.cvController = new CVController();
//# sourceMappingURL=cv.controller.js.map