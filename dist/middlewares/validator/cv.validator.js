"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateCVGeneration = void 0;
const joi_1 = __importDefault(require("joi"));
const cvGenerationSchema = joi_1.default.object({
    templateType: joi_1.default.string().valid('ats', 'modern', 'creative').default('ats'),
    additionalInfo: joi_1.default.object({
        objective: joi_1.default.string().max(500).optional(),
        linkedin: joi_1.default.string().max(200).optional(),
        portfolio: joi_1.default.string().max(200).optional(),
        skills: joi_1.default.array().items(joi_1.default.string().max(100)).max(20).optional(),
        skillCategories: joi_1.default.object().pattern(joi_1.default.string(), joi_1.default.array().items(joi_1.default.string())).optional(),
        languages: joi_1.default.array().items(joi_1.default.object({
            name: joi_1.default.string().max(50).required(),
            level: joi_1.default.string().valid('Beginner', 'Intermediate', 'Advanced', 'Native').required()
        })).max(10).optional(),
        workExperience: joi_1.default.array().items(joi_1.default.object({
            company: joi_1.default.string().max(100).required(),
            position: joi_1.default.string().max(100).required(),
            startDate: joi_1.default.string().max(20).required(),
            endDate: joi_1.default.string().max(20).required(),
            responsibilities: joi_1.default.array().items(joi_1.default.string().max(300)).max(10).required()
        })).max(10).optional(),
        educationDetails: joi_1.default.array().items(joi_1.default.object({
            institution: joi_1.default.string().max(100).required(),
            degree: joi_1.default.string().max(100).required(),
            year: joi_1.default.string().max(20).required(),
            gpa: joi_1.default.string().max(10).optional()
        })).max(10).optional(),
        certifications: joi_1.default.array().items(joi_1.default.object({
            name: joi_1.default.string().max(100).required(),
            issuer: joi_1.default.string().max(100).required(),
            date: joi_1.default.string().max(20).required(),
            link: joi_1.default.string().max(300).optional()
        })).max(10).optional(),
        projects: joi_1.default.array().items(joi_1.default.object({
            name: joi_1.default.string().max(100).required(),
            description: joi_1.default.string().max(500).required(),
            technologies: joi_1.default.array().items(joi_1.default.string().max(50)).max(10).required(),
            url: joi_1.default.string().max(300).optional()
        })).max(10).optional(),
        references: joi_1.default.array().items(joi_1.default.object({
            name: joi_1.default.string().max(100).required(),
            position: joi_1.default.string().max(100).required(),
            company: joi_1.default.string().max(100).required(),
            phone: joi_1.default.string().max(20).required(),
            email: joi_1.default.string().email().required()
        })).max(5).optional()
    }).optional()
});
const validateCVGeneration = (req, res, next) => {
    const { error, value } = cvGenerationSchema.validate(req.body, {
        abortEarly: false,
        stripUnknown: true
    });
    if (error) {
        const errorMessages = error.details.map((detail) => detail.message);
        return res.status(400).json({
            message: 'Validation error',
            errors: errorMessages
        });
    }
    req.body = value;
    next();
};
exports.validateCVGeneration = validateCVGeneration;
//# sourceMappingURL=cv.validator.js.map