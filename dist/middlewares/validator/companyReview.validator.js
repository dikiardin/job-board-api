"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateGetReviews = exports.validateCreateReview = void 0;
const joi_1 = __importDefault(require("joi"));
const customError_1 = require("../../utils/customError");
// Validation schema for creating/updating a review
const createReviewSchema = joi_1.default.object({
    position: joi_1.default.string()
        .min(2)
        .max(100)
        .required()
        .messages({
        'string.empty': 'Position is required',
        'string.min': 'Position must be at least 2 characters long',
        'string.max': 'Position must not exceed 100 characters',
        'any.required': 'Position is required'
    }),
    salaryEstimate: joi_1.default.number()
        .integer()
        .min(1000000) // Minimum 1 million IDR
        .max(1000000000) // Maximum 1 billion IDR
        .optional()
        .allow(null)
        .messages({
        'number.base': 'Salary estimate must be a number',
        'number.integer': 'Salary estimate must be an integer',
        'number.min': 'Salary estimate must be at least 1,000,000 IDR',
        'number.max': 'Salary estimate must not exceed 1,000,000,000 IDR'
    }),
    cultureRating: joi_1.default.number()
        .integer()
        .min(1)
        .max(5)
        .required()
        .messages({
        'number.base': 'Culture rating must be a number',
        'number.integer': 'Culture rating must be an integer',
        'number.min': 'Culture rating must be at least 1',
        'number.max': 'Culture rating must not exceed 5',
        'any.required': 'Culture rating is required'
    }),
    worklifeRating: joi_1.default.number()
        .integer()
        .min(1)
        .max(5)
        .required()
        .messages({
        'number.base': 'Work-life balance rating must be a number',
        'number.integer': 'Work-life balance rating must be an integer',
        'number.min': 'Work-life balance rating must be at least 1',
        'number.max': 'Work-life balance rating must not exceed 5',
        'any.required': 'Work-life balance rating is required'
    }),
    facilityRating: joi_1.default.number()
        .integer()
        .min(1)
        .max(5)
        .required()
        .messages({
        'number.base': 'Facility rating must be a number',
        'number.integer': 'Facility rating must be an integer',
        'number.min': 'Facility rating must be at least 1',
        'number.max': 'Facility rating must not exceed 5',
        'any.required': 'Facility rating is required'
    }),
    careerRating: joi_1.default.number()
        .integer()
        .min(1)
        .max(5)
        .required()
        .messages({
        'number.base': 'Career opportunity rating must be a number',
        'number.integer': 'Career opportunity rating must be an integer',
        'number.min': 'Career opportunity rating must be at least 1',
        'number.max': 'Career opportunity rating must not exceed 5',
        'any.required': 'Career opportunity rating is required'
    }),
    comment: joi_1.default.string()
        .max(1000)
        .optional()
        .allow('')
        .messages({
        'string.max': 'Comment must not exceed 1000 characters'
    })
});
// Validation schema for getting reviews (query parameters)
const getReviewsSchema = joi_1.default.object({
    page: joi_1.default.number()
        .integer()
        .min(1)
        .optional()
        .default(1)
        .messages({
        'number.base': 'Page must be a number',
        'number.integer': 'Page must be an integer',
        'number.min': 'Page must be at least 1'
    }),
    limit: joi_1.default.number()
        .integer()
        .min(1)
        .max(50)
        .optional()
        .default(10)
        .messages({
        'number.base': 'Limit must be a number',
        'number.integer': 'Limit must be an integer',
        'number.min': 'Limit must be at least 1',
        'number.max': 'Limit must not exceed 50'
    }),
    sortBy: joi_1.default.string()
        .valid('createdAt', 'rating')
        .optional()
        .default('createdAt')
        .messages({
        'any.only': 'Sort by must be either "createdAt" or "rating"'
    }),
    sortOrder: joi_1.default.string()
        .valid('asc', 'desc')
        .optional()
        .default('desc')
        .messages({
        'any.only': 'Sort order must be either "asc" or "desc"'
    })
});
// Middleware to validate create/update review data
const validateCreateReview = (req, res, next) => {
    const { error, value } = createReviewSchema.validate(req.body, {
        abortEarly: false,
        stripUnknown: true
    });
    if (error) {
        const errorMessages = error.details.map(detail => detail.message);
        throw new customError_1.CustomError(errorMessages.join(', '), 400);
    }
    req.body = value;
    next();
};
exports.validateCreateReview = validateCreateReview;
// Middleware to validate get reviews query parameters
const validateGetReviews = (req, res, next) => {
    const { error, value } = getReviewsSchema.validate(req.query, {
        abortEarly: false,
        stripUnknown: true
    });
    if (error) {
        const errorMessages = error.details.map(detail => detail.message);
        throw new customError_1.CustomError(errorMessages.join(', '), 400);
    }
    req.query = value;
    next();
};
exports.validateGetReviews = validateGetReviews;
//# sourceMappingURL=companyReview.validator.js.map