"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SkillAssessmentValidator = void 0;
const assessmentValidationSchemas_1 = require("../../utils/assessmentValidationSchemas");
class SkillAssessmentValidator {
}
exports.SkillAssessmentValidator = SkillAssessmentValidator;
SkillAssessmentValidator.validateCreateAssessment = (req, res, next) => {
    const { error } = assessmentValidationSchemas_1.AssessmentValidationSchemas.createAssessmentSchema.validate(req.body);
    if (error) {
        return res.status(400).json({
            message: "Validation error",
            details: error.details?.[0]?.message || "Invalid request data",
        });
    }
    next();
};
SkillAssessmentValidator.validateSubmitAssessment = (req, res, next) => {
    const { error } = assessmentValidationSchemas_1.AssessmentValidationSchemas.submitAssessmentSchema.validate(req.body);
    if (error) {
        return res.status(400).json({
            message: "Validation error",
            details: error.details?.[0]?.message || "Invalid request data",
        });
    }
    next();
};
SkillAssessmentValidator.validateUpdateAssessment = (req, res, next) => {
    const { error } = assessmentValidationSchemas_1.AssessmentValidationSchemas.updateAssessmentSchema.validate(req.body);
    if (error) {
        return res.status(400).json({
            message: "Validation error",
            details: error.details?.[0]?.message || "Invalid request data",
        });
    }
    next();
};
SkillAssessmentValidator.validatePagination = (req, res, next) => {
    const { error } = assessmentValidationSchemas_1.AssessmentValidationSchemas.paginationSchema.validate(req.query);
    if (error) {
        return res.status(400).json({
            message: "Validation error",
            details: error.details?.[0]?.message || "Invalid request data",
        });
    }
    next();
};
SkillAssessmentValidator.validateSaveQuestion = (req, res, next) => {
    const { error } = assessmentValidationSchemas_1.AssessmentValidationSchemas.saveQuestionSchema.validate(req.body);
    if (error) {
        return res.status(400).json({
            message: "Validation error",
            details: error.details?.[0]?.message || "Invalid request data",
        });
    }
    next();
};
SkillAssessmentValidator.validateAssessmentId = (req, res, next) => {
    const { assessmentId } = req.params;
    if (!assessmentId || isNaN(parseInt(assessmentId))) {
        return res.status(400).json({
            message: "Validation error",
            details: "Valid assessment ID is required",
        });
    }
    next();
};
SkillAssessmentValidator.validateAssessmentSlug = (req, res, next) => {
    const { slug } = req.params;
    if (!slug || typeof slug !== "string" || slug.trim().length < 3) {
        return res.status(400).json({
            message: "Validation error",
            details: "Valid assessment slug is required",
        });
    }
    next();
};
SkillAssessmentValidator.validateCertificateCode = (req, res, next) => {
    const { certificateCode } = req.params;
    if (!certificateCode || certificateCode.trim().length === 0) {
        return res.status(400).json({
            message: "Validation error",
            details: "Certificate code is required",
        });
    }
    next();
};
SkillAssessmentValidator.validateResultId = (req, res, next) => {
    const { resultId } = req.params;
    if (!resultId || isNaN(parseInt(resultId))) {
        return res.status(400).json({
            message: "Validation error",
            details: "Valid result ID is required",
        });
    }
    next();
};
