"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateSaveQuestion = exports.validateResultId = exports.validateCertificateCode = exports.validateAssessmentId = exports.validatePagination = exports.validateUpdateAssessment = exports.validateSubmitAssessment = exports.validateCreateAssessment = void 0;
const joi_1 = __importDefault(require("joi"));
// Validation schemas
const createAssessmentSchema = joi_1.default.object({
    title: joi_1.default.string().min(1).required().messages({
        "string.min": "Title is required",
        "any.required": "Title is required",
    }),
    description: joi_1.default.string().optional(),
    badgeTemplateId: joi_1.default.number().integer().positive().optional().messages({
        "number.positive": "Badge template ID must be a positive number",
    }),
    questions: joi_1.default.array()
        .items(joi_1.default.object({
        question: joi_1.default.string().min(1).required().messages({
            "string.min": "Question text is required",
            "any.required": "Question text is required",
        }),
        options: joi_1.default.array()
            .items(joi_1.default.string().min(1).required())
            .length(4)
            .required()
            .messages({
            "array.length": "Each question must have exactly 4 options",
            "any.required": "Options are required",
        }),
        answer: joi_1.default.string().min(1).required().messages({
            "any.required": "Correct answer is required",
        }),
    }))
        .min(0)
        .required()
        .messages({
        "array.min": "Questions array is required",
        "any.required": "Questions are required",
    }),
});
const submitAssessmentSchema = joi_1.default.object({
    startedAt: joi_1.default.string().isoDate().required().messages({
        "string.isoDate": "Started time must be a valid ISO date",
        "any.required": "Started time is required",
    }),
    answers: joi_1.default.array()
        .items(joi_1.default.object({
        questionId: joi_1.default.number().integer().positive().required().messages({
            "number.positive": "Question ID must be a positive number",
            "any.required": "Question ID is required",
        }),
        selectedAnswer: joi_1.default.string().min(1).max(200).required().messages({
            "any.required": "Selected answer is required",
        }),
    }))
        .min(1)
        .max(25)
        .required()
        .messages({
        "array.min": "At least 1 answer is required",
        "array.max": "Maximum 25 answers allowed",
        "any.required": "Answers are required",
    }),
});
const updateAssessmentSchema = joi_1.default.object({
    title: joi_1.default.string().min(1).optional().messages({
        "string.min": "Title is required",
    }),
    description: joi_1.default.string().optional(),
    badgeTemplateId: joi_1.default.number().integer().positive().optional().allow(null).messages({
        "number.positive": "Badge template ID must be a positive number",
    }),
    questions: joi_1.default.array()
        .items(joi_1.default.object({
        question: joi_1.default.string().min(1).required().messages({
            "string.min": "Question text is required",
            "any.required": "Question text is required",
        }),
        options: joi_1.default.array()
            .items(joi_1.default.string().min(1).required())
            .length(4)
            .required()
            .messages({
            "array.length": "Each question must have exactly 4 options",
            "any.required": "Options are required",
        }),
        answer: joi_1.default.string().min(1).required().messages({
            "any.required": "Correct answer is required",
        }),
    }))
        .min(0)
        .optional()
        .messages({
        "array.min": "Questions array is required",
    }),
}).min(1).messages({
    "object.min": "At least one field (title, description, badgeTemplateId, or questions) must be provided",
});
const saveQuestionSchema = joi_1.default.object({
    assessmentId: joi_1.default.number().integer().positive().required().messages({
        "number.positive": "Assessment ID must be a positive number",
        "any.required": "Assessment ID is required",
    }),
    question: joi_1.default.string().min(1).required().messages({
        "string.min": "Question text is required",
        "any.required": "Question text is required",
    }),
    options: joi_1.default.array()
        .items(joi_1.default.string().min(1).required())
        .length(4)
        .required()
        .messages({
        "array.length": "Each question must have exactly 4 options",
        "any.required": "Options are required",
    }),
    answer: joi_1.default.string().min(1).required().messages({
        "any.required": "Correct answer is required",
    }),
});
const paginationSchema = joi_1.default.object({
    page: joi_1.default.number().integer().min(1).optional().messages({
        "number.min": "Page must be at least 1",
    }),
    limit: joi_1.default.number().integer().min(1).max(50).optional().messages({
        "number.min": "Limit must be at least 1",
        "number.max": "Limit must not exceed 50",
    }),
});
// Validation middleware functions
const validateCreateAssessment = (req, res, next) => {
    const { error } = createAssessmentSchema.validate(req.body);
    if (error) {
        return res.status(400).json({
            success: false,
            message: "Validation error",
            errors: error.details.map((detail) => detail.message),
        });
    }
    // Additional validation: check if answer is one of the options (only if questions exist)
    if (req.body.questions && req.body.questions.length > 0) {
        for (let i = 0; i < req.body.questions.length; i++) {
            const question = req.body.questions[i];
            if (!question.options.includes(question.answer)) {
                return res.status(400).json({
                    success: false,
                    message: `Question ${i + 1}: Answer must be one of the provided options`,
                });
            }
        }
    }
    next();
};
exports.validateCreateAssessment = validateCreateAssessment;
const validateSubmitAssessment = (req, res, next) => {
    const { error } = submitAssessmentSchema.validate(req.body);
    if (error) {
        return res.status(400).json({
            success: false,
            message: "Validation error",
            errors: error.details.map((detail) => detail.message),
        });
    }
    // Check if started time is not in the future
    const startedAt = new Date(req.body.startedAt);
    const now = new Date();
    if (startedAt > now) {
        return res.status(400).json({
            success: false,
            message: "Started time cannot be in the future",
        });
    }
    // Check if time difference is reasonable (30 minutes + 2 minutes buffer for network delays)
    const timeDiff = now.getTime() - startedAt.getTime();
    const minutesDiff = timeDiff / (1000 * 60);
    if (minutesDiff > 32) {
        return res.status(400).json({
            success: false,
            message: `Assessment submission time exceeded maximum allowed duration of 30 minutes. Time taken: ${Math.round(minutesDiff * 100) / 100} minutes`,
        });
    }
    next();
};
exports.validateSubmitAssessment = validateSubmitAssessment;
const validateUpdateAssessment = (req, res, next) => {
    const { error } = updateAssessmentSchema.validate(req.body);
    if (error) {
        return res.status(400).json({
            success: false,
            message: "Validation error",
            errors: error.details.map((detail) => detail.message),
        });
    }
    next();
};
exports.validateUpdateAssessment = validateUpdateAssessment;
const validatePagination = (req, res, next) => {
    const { error } = paginationSchema.validate(req.query);
    if (error) {
        return res.status(400).json({
            success: false,
            message: "Validation error",
            errors: error.details.map((detail) => detail.message),
        });
    }
    next();
};
exports.validatePagination = validatePagination;
const validateAssessmentId = (req, res, next) => {
    const assessmentId = parseInt(req.params.assessmentId || '0');
    if (isNaN(assessmentId) || assessmentId <= 0) {
        return res.status(400).json({
            success: false,
            message: "Invalid assessment ID",
        });
    }
    next();
};
exports.validateAssessmentId = validateAssessmentId;
const validateCertificateCode = (req, res, next) => {
    const { certificateCode } = req.params;
    if (!certificateCode || certificateCode.length < 5) {
        return res.status(400).json({
            success: false,
            message: "Valid certificate code is required",
        });
    }
    next();
};
exports.validateCertificateCode = validateCertificateCode;
const validateResultId = (req, res, next) => {
    const { resultId } = req.params;
    const id = parseInt(resultId || '0');
    if (isNaN(id) || id <= 0) {
        return res.status(400).json({
            success: false,
            message: "Valid result ID is required",
        });
    }
    next();
};
exports.validateResultId = validateResultId;
const validateSaveQuestion = (req, res, next) => {
    const { error } = saveQuestionSchema.validate(req.body);
    if (error) {
        return res.status(400).json({
            success: false,
            message: "Validation error",
            errors: error.details.map((detail) => detail.message),
        });
    }
    // Additional validation: check if answer is one of the options
    const { options, answer } = req.body;
    if (!options.includes(answer)) {
        return res.status(400).json({
            success: false,
            message: "Answer must be one of the provided options",
        });
    }
    next();
};
exports.validateSaveQuestion = validateSaveQuestion;
//# sourceMappingURL=skillAssessment.validator.js.map