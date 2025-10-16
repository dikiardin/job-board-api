"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssessmentValidationSchemas = void 0;
const joi_1 = __importDefault(require("joi"));
class AssessmentValidationSchemas {
}
exports.AssessmentValidationSchemas = AssessmentValidationSchemas;
AssessmentValidationSchemas.createAssessmentSchema = joi_1.default.object({
    title: joi_1.default.string().min(1).required().messages({
        "string.min": "Title is required",
        "any.required": "Title is required",
    }),
    description: joi_1.default.string().optional(),
    category: joi_1.default.string().min(1).required().messages({
        "string.min": "Category is required",
        "any.required": "Category is required",
    }),
    badgeTemplateId: joi_1.default.number().integer().positive().optional().messages({
        "number.positive": "Badge template ID must be a positive number",
    }),
    passScore: joi_1.default.number().integer().min(1).max(100).optional().default(75).messages({
        "number.min": "Pass score must be at least 1%",
        "number.max": "Pass score cannot exceed 100%",
        "number.integer": "Pass score must be a whole number",
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
        .min(1)
        .required()
        .messages({
        "array.min": "At least one question is required",
        "any.required": "Questions are required",
    }),
});
AssessmentValidationSchemas.submitAssessmentSchema = joi_1.default.object({
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
        answer: joi_1.default.string().min(1).required().messages({
            "string.min": "Answer is required",
            "any.required": "Answer is required",
        }),
    }))
        .min(0)
        .required()
        .messages({
        "array.min": "Answers array is required",
        "any.required": "Answers are required",
    }),
});
AssessmentValidationSchemas.updateAssessmentSchema = joi_1.default.object({
    title: joi_1.default.string().min(1).optional(),
    description: joi_1.default.string().optional(),
    category: joi_1.default.string().min(1).optional(),
    badgeTemplateId: joi_1.default.number().integer().positive().optional(),
    passScore: joi_1.default.number().integer().min(1).max(100).optional().messages({
        "number.min": "Pass score must be at least 1%",
        "number.max": "Pass score cannot exceed 100%",
        "number.integer": "Pass score must be a whole number",
    }),
    questions: joi_1.default.array()
        .items(joi_1.default.object({
        question: joi_1.default.string().min(1).required(),
        options: joi_1.default.array().items(joi_1.default.string().min(1).required()).length(4).required(),
        answer: joi_1.default.string().min(1).required(),
    }))
        .min(0)
        .optional(),
});
AssessmentValidationSchemas.paginationSchema = joi_1.default.object({
    page: joi_1.default.number().integer().min(1).optional().default(1),
    limit: joi_1.default.number().integer().min(1).max(100).optional().default(10),
});
AssessmentValidationSchemas.saveQuestionSchema = joi_1.default.object({
    assessmentId: joi_1.default.number().integer().positive().required(),
    question: joi_1.default.string().min(1).required(),
    options: joi_1.default.array().items(joi_1.default.string().min(1).required()).length(4).required(),
    answer: joi_1.default.string().min(1).required(),
});
