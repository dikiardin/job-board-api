"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateCategory = exports.validateTemplateId = exports.validatePagination = exports.validateSearchBadgeTemplate = exports.validateUpdateBadgeTemplate = exports.validateCreateBadgeTemplate = void 0;
const joi_1 = __importDefault(require("joi"));
const badgeTemplate_validation_helpers_1 = require("./badgeTemplate.validation.helpers");
// Validation schemas
const createBadgeTemplateSchema = joi_1.default.object({
    name: joi_1.default.string().min(3).max(50).required().messages({
        "string.min": "Badge name must be at least 3 characters long",
        "string.max": "Badge name must not exceed 50 characters",
        "any.required": "Badge name is required",
    }),
    icon: joi_1.default.string().max(500).optional().messages({
        "string.max": "Badge icon must not exceed 500 characters",
    }),
    description: joi_1.default.string().max(200).optional().messages({
        "string.max": "Description must not exceed 200 characters",
    }),
    category: joi_1.default.string().max(30).optional().messages({
        "string.max": "Category must not exceed 30 characters",
    }),
});
const updateBadgeTemplateSchema = joi_1.default.object({
    name: joi_1.default.string().min(3).max(50).optional().messages({
        "string.min": "Badge name must be at least 3 characters long",
        "string.max": "Badge name must not exceed 50 characters",
    }),
    icon: joi_1.default.string().max(500).optional().allow("").messages({
        "string.max": "Badge icon must not exceed 500 characters",
    }),
    description: joi_1.default.string().max(200).optional().allow("").messages({
        "string.max": "Description must not exceed 200 characters",
    }),
    category: joi_1.default.string().max(30).optional().allow("").messages({
        "string.max": "Category must not exceed 30 characters",
    }),
})
    .min(1)
    .messages({
    "object.min": "At least one field must be provided for update",
});
const searchBadgeTemplateSchema = joi_1.default.object({
    q: joi_1.default.string().min(2).max(50).required().messages({
        "string.min": "Search query must be at least 2 characters long",
        "string.max": "Search query must not exceed 50 characters",
        "any.required": "Search query is required",
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
// Validation middleware functions for form-data
const validateCreateBadgeTemplate = (req, res, next) => {
    const { name, description, category } = (0, badgeTemplate_validation_helpers_1.extractFormDataFields)(req.body);
    const nameValidation = (0, badgeTemplate_validation_helpers_1.validateBadgeName)(name);
    if (!nameValidation.valid) {
        return res.status(400).json({
            success: false,
            message: nameValidation.error,
        });
    }
    const descValidation = (0, badgeTemplate_validation_helpers_1.validateBadgeDescription)(description);
    if (!descValidation.valid) {
        return res.status(400).json({
            success: false,
            message: descValidation.error,
        });
    }
    const catValidation = (0, badgeTemplate_validation_helpers_1.validateBadgeCategory)(category);
    if (!catValidation.valid) {
        return res.status(400).json({
            success: false,
            message: catValidation.error,
        });
    }
    const fileValidation = (0, badgeTemplate_validation_helpers_1.validateBadgeFile)(req.file);
    if (!fileValidation.valid) {
        return res.status(400).json({
            success: false,
            message: fileValidation.error,
        });
    }
    next();
};
exports.validateCreateBadgeTemplate = validateCreateBadgeTemplate;
const validateUpdateBadgeTemplate = (req, res, next) => {
    const { name, description, category } = req.body;
    if (!name && !description && !category && !req.file) {
        return res.status(400).json({
            success: false,
            message: "At least one field (name, description, category, or icon) must be provided for update",
        });
    }
    const nameValidation = (0, badgeTemplate_validation_helpers_1.validateBadgeNameForUpdate)(name);
    if (!nameValidation.valid) {
        return res.status(400).json({
            success: false,
            message: nameValidation.error,
        });
    }
    const descValidation = (0, badgeTemplate_validation_helpers_1.validateBadgeDescription)(description);
    if (!descValidation.valid) {
        return res.status(400).json({
            success: false,
            message: descValidation.error,
        });
    }
    const catValidation = (0, badgeTemplate_validation_helpers_1.validateBadgeCategory)(category);
    if (!catValidation.valid) {
        return res.status(400).json({
            success: false,
            message: catValidation.error,
        });
    }
    next();
};
exports.validateUpdateBadgeTemplate = validateUpdateBadgeTemplate;
const validateSearchBadgeTemplate = (req, res, next) => {
    const { error } = searchBadgeTemplateSchema.validate(req.query);
    if (error) {
        return res.status(400).json({
            success: false,
            message: "Validation error",
            errors: error.details.map((detail) => detail.message),
        });
    }
    next();
};
exports.validateSearchBadgeTemplate = validateSearchBadgeTemplate;
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
const validateTemplateId = (req, res, next) => {
    const templateId = parseInt(req.params.templateId || "0");
    if (isNaN(templateId) || templateId <= 0) {
        return res.status(400).json({
            success: false,
            message: "Invalid template ID",
        });
    }
    next();
};
exports.validateTemplateId = validateTemplateId;
const validateCategory = (req, res, next) => {
    const { category } = req.params;
    if (!category || category.trim().length < 2) {
        return res.status(400).json({
            success: false,
            message: "Category must be at least 2 characters long",
        });
    }
    next();
};
exports.validateCategory = validateCategory;
