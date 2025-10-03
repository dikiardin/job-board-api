"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SkillAssessmentController = void 0;
const skillAssessment_service_1 = require("../../services/skillAssessment/skillAssessment.service");
const badge_service_1 = require("../../services/skillAssessment/badge.service");
const customError_1 = require("../../utils/customError");
class SkillAssessmentController {
    // Create assessment (Developer only)
    static async createAssessment(req, res, next) {
        try {
            const { userId, role } = res.locals.decrypt;
            const { title, description, questions, badgeTemplateId } = req.body;
            if (!title) {
                throw new customError_1.CustomError("Title is required", 400);
            }
            if (!Array.isArray(questions)) {
                throw new customError_1.CustomError("Questions must be an array", 400);
            }
            const assessment = await skillAssessment_service_1.SkillAssessmentService.createAssessment({
                title,
                description,
                badgeTemplateId,
                createdBy: userId,
                userRole: role,
                questions,
            });
            res.status(201).json({
                success: true,
                message: "Assessment created successfully",
                data: assessment,
            });
        }
        catch (error) {
            next(error);
        }
    }
    // Get all assessments (for discovery)
    static async getAssessments(req, res, next) {
        try {
            const page = parseInt(req.query.page || '1');
            const limit = parseInt(req.query.limit || '10');
            const result = await skillAssessment_service_1.SkillAssessmentService.getAssessments(page, limit);
            res.status(200).json({
                success: true,
                message: "Assessments retrieved successfully",
                data: result,
            });
        }
        catch (error) {
            next(error);
        }
    }
    // Get assessment for taking (authenticated users with subscription)
    static async getAssessmentForUser(req, res, next) {
        try {
            const { userId } = res.locals.decrypt;
            const assessmentId = parseInt(req.params.assessmentId || '0');
            if (isNaN(assessmentId)) {
                throw new customError_1.CustomError("Invalid assessment ID", 400);
            }
            const assessment = await skillAssessment_service_1.SkillAssessmentService.getAssessmentForUser(assessmentId, userId);
            res.status(200).json({
                success: true,
                message: "Assessment retrieved successfully",
                data: assessment,
            });
        }
        catch (error) {
            next(error);
        }
    }
    // Submit assessment answers
    static async submitAssessment(req, res, next) {
        try {
            const { userId } = res.locals.decrypt;
            const assessmentId = parseInt(req.params.assessmentId || '0');
            const { answers, startedAt } = req.body;
            if (isNaN(assessmentId)) {
                throw new customError_1.CustomError("Invalid assessment ID", 400);
            }
            const result = await skillAssessment_service_1.SkillAssessmentService.submitAssessment({
                userId,
                assessmentId,
                startedAt,
                answers,
            });
            res.status(200).json({
                success: true,
                message: "Assessment submitted successfully",
                data: result,
            });
        }
        catch (error) {
            next(error);
        }
    }
    // Get user's assessment results
    static async getUserResults(req, res, next) {
        try {
            const { userId } = res.locals.decrypt;
            const results = await skillAssessment_service_1.SkillAssessmentService.getUserResults(userId);
            res.status(200).json({
                success: true,
                message: "User results retrieved successfully",
                data: results,
            });
        }
        catch (error) {
            next(error);
        }
    }
    // Get developer's assessments
    static async getDeveloperAssessments(req, res, next) {
        try {
            const { userId, role } = res.locals.decrypt;
            const assessments = await skillAssessment_service_1.SkillAssessmentService.getDeveloperAssessments(userId, role);
            res.status(200).json({
                success: true,
                message: "Developer assessments retrieved successfully",
                data: assessments,
            });
        }
        catch (error) {
            next(error);
        }
    }
    // Get single assessment by ID (Developer only, for editing)
    static async getAssessmentById(req, res, next) {
        try {
            const { userId, role } = res.locals.decrypt;
            const assessmentId = parseInt(req.params.assessmentId || '0');
            if (isNaN(assessmentId)) {
                throw new customError_1.CustomError("Invalid assessment ID", 400);
            }
            const assessment = await skillAssessment_service_1.SkillAssessmentService.getAssessmentByIdForDeveloper(assessmentId, userId, role);
            res.status(200).json({
                success: true,
                message: "Assessment retrieved successfully",
                data: assessment,
            });
        }
        catch (error) {
            next(error);
        }
    }
    // Download certificate (User only)
    static async downloadCertificate(req, res, next) {
        try {
            const { userId } = res.locals.decrypt;
            const resultId = parseInt(req.params.resultId || '0');
            if (isNaN(resultId)) {
                throw new customError_1.CustomError("Invalid result ID", 400);
            }
            const certificateData = await skillAssessment_service_1.SkillAssessmentService.downloadCertificate(resultId, userId);
            // Fetch PDF from Cloudinary and stream to client
            let response = await fetch(certificateData.certificateUrl);
            if (!response.ok) {
                // Try without .pdf extension (fallback like CV)
                const urlWithoutPdf = certificateData.certificateUrl.replace('.pdf', '');
                response = await fetch(urlWithoutPdf);
            }
            if (!response.ok) {
                // As fallback, redirect to original Cloudinary URL
                return res.redirect(certificateData.certificateUrl);
            }
            const buffer = await response.arrayBuffer();
            const pdfBuffer = Buffer.from(buffer);
            const pdfHeader = pdfBuffer.toString('ascii', 0, 4);
            if (!pdfHeader.startsWith('%PDF')) {
                throw new customError_1.CustomError('Invalid certificate file', 500);
            }
            // Set proper headers for PDF download
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename="certificate-${certificateData.certificateCode}.pdf"`);
            res.setHeader('Content-Length', buffer.byteLength.toString());
            res.setHeader('Cache-Control', 'no-cache');
            // Send the PDF buffer
            res.send(pdfBuffer);
        }
        catch (error) {
            next(error);
        }
    }
    // Verify certificate (Public)
    static async verifyCertificate(req, res, next) {
        try {
            const { certificateCode } = req.params;
            if (!certificateCode) {
                throw new customError_1.CustomError("Certificate code is required", 400);
            }
            const result = await skillAssessment_service_1.SkillAssessmentService.verifyCertificate(certificateCode);
            res.status(200).json({
                success: true,
                message: "Certificate verified successfully",
                data: result,
            });
        }
        catch (error) {
            next(error);
        }
    }
    // Get assessment results (Developer only)
    static async getAssessmentResults(req, res, next) {
        try {
            const { userId, role } = res.locals.decrypt;
            const assessmentId = parseInt(req.params.assessmentId || '0');
            if (isNaN(assessmentId)) {
                throw new customError_1.CustomError("Invalid assessment ID", 400);
            }
            const results = await skillAssessment_service_1.SkillAssessmentService.getAssessmentResults(assessmentId, userId, role);
            res.status(200).json({
                success: true,
                message: "Assessment results retrieved successfully",
                data: results,
            });
        }
        catch (error) {
            next(error);
        }
    }
    // Get user badges
    static async getUserBadges(req, res, next) {
        try {
            const { userId } = res.locals.decrypt;
            const badges = await badge_service_1.BadgeService.getUserBadges(userId);
            res.status(200).json({
                success: true,
                message: "User badges retrieved successfully",
                data: badges,
            });
        }
        catch (error) {
            next(error);
        }
    }
    // Update assessment (Developer only)
    static async updateAssessment(req, res, next) {
        try {
            const { userId, role } = res.locals.decrypt;
            const assessmentId = parseInt(req.params.assessmentId || '0');
            const { title, description, badgeTemplateId, questions } = req.body;
            if (isNaN(assessmentId)) {
                throw new customError_1.CustomError("Invalid assessment ID", 400);
            }
            const result = await skillAssessment_service_1.SkillAssessmentService.updateAssessment(assessmentId, userId, role, { title, description, badgeTemplateId, questions });
            res.status(200).json({
                success: true,
                ...result,
            });
        }
        catch (error) {
            next(error);
        }
    }
    // Save individual question (Developer only)
    static async saveQuestion(req, res, next) {
        try {
            const { userId, role } = res.locals.decrypt;
            const { assessmentId, question, options, answer } = req.body;
            if (!assessmentId || !question || !options || !answer) {
                throw new customError_1.CustomError("Assessment ID, question, options, and answer are required", 400);
            }
            if (!Array.isArray(options) || options.length !== 4) {
                throw new customError_1.CustomError("Options must be an array of 4 items", 400);
            }
            if (!options.includes(answer)) {
                throw new customError_1.CustomError("Answer must be one of the provided options", 400);
            }
            const result = await skillAssessment_service_1.SkillAssessmentService.saveQuestion({
                assessmentId,
                question,
                options,
                answer,
                userId,
                userRole: role
            });
            res.status(201).json({
                success: true,
                message: "Question saved successfully",
                data: result,
            });
        }
        catch (error) {
            next(error);
        }
    }
    // Delete assessment (Developer only)
    static async deleteAssessment(req, res, next) {
        try {
            const { userId, role } = res.locals.decrypt;
            const assessmentId = parseInt(req.params.assessmentId || '0');
            if (isNaN(assessmentId)) {
                throw new customError_1.CustomError("Invalid assessment ID", 400);
            }
            const result = await skillAssessment_service_1.SkillAssessmentService.deleteAssessment(assessmentId, userId, role);
            res.status(200).json({
                success: true,
                ...result,
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.SkillAssessmentController = SkillAssessmentController;
//# sourceMappingURL=skillAssessment.controller.js.map