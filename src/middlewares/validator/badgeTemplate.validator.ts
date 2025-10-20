import { Request, Response, NextFunction } from "express";
import Joi from "joi";
import {
  validateBadgeName,
  validateBadgeDescription,
  validateBadgeCategory,
  validateBadgeFile,
  validateBadgeNameForUpdate,
  extractFormDataFields,
} from "./badgeTemplate.validation.helpers";

// Validation schemas
const createBadgeTemplateSchema = Joi.object({
  name: Joi.string().min(3).max(50).required().messages({
    "string.min": "Badge name must be at least 3 characters long",
    "string.max": "Badge name must not exceed 50 characters",
    "any.required": "Badge name is required",
  }),
  icon: Joi.string().max(500).optional().messages({
    "string.max": "Badge icon must not exceed 500 characters",
  }),
  description: Joi.string().max(200).optional().messages({
    "string.max": "Description must not exceed 200 characters",
  }),
  category: Joi.string().max(30).optional().messages({
    "string.max": "Category must not exceed 30 characters",
  }),
});

const updateBadgeTemplateSchema = Joi.object({
  name: Joi.string().min(3).max(50).optional().messages({
    "string.min": "Badge name must be at least 3 characters long",
    "string.max": "Badge name must not exceed 50 characters",
  }),
  icon: Joi.string().max(500).optional().allow("").messages({
    "string.max": "Badge icon must not exceed 500 characters",
  }),
  description: Joi.string().max(200).optional().allow("").messages({
    "string.max": "Description must not exceed 200 characters",
  }),
  category: Joi.string().max(30).optional().allow("").messages({
    "string.max": "Category must not exceed 30 characters",
  }),
})
  .min(1)
  .messages({
    "object.min": "At least one field must be provided for update",
  });

const searchBadgeTemplateSchema = Joi.object({
  q: Joi.string().min(2).max(50).required().messages({
    "string.min": "Search query must be at least 2 characters long",
    "string.max": "Search query must not exceed 50 characters",
    "any.required": "Search query is required",
  }),
});

const paginationSchema = Joi.object({
  page: Joi.number().integer().min(1).optional().messages({
    "number.min": "Page must be at least 1",
  }),
  limit: Joi.number().integer().min(1).max(50).optional().messages({
    "number.min": "Limit must be at least 1",
    "number.max": "Limit must not exceed 50",
  }),
});

// Validation middleware functions for form-data
export const validateCreateBadgeTemplate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, description, category } = extractFormDataFields(req.body);

  const nameValidation = validateBadgeName(name);
  if (!nameValidation.valid) {
    return res.status(400).json({
      success: false,
      message: nameValidation.error,
    });
  }

  const descValidation = validateBadgeDescription(description);
  if (!descValidation.valid) {
    return res.status(400).json({
      success: false,
      message: descValidation.error,
    });
  }

  const catValidation = validateBadgeCategory(category);
  if (!catValidation.valid) {
    return res.status(400).json({
      success: false,
      message: catValidation.error,
    });
  }

  const fileValidation = validateBadgeFile(req.file);
  if (!fileValidation.valid) {
    return res.status(400).json({
      success: false,
      message: fileValidation.error,
    });
  }

  next();
};

export const validateUpdateBadgeTemplate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, description, category } = req.body;

  if (!name && !description && !category && !req.file) {
    return res.status(400).json({
      success: false,
      message:
        "At least one field (name, description, category, or icon) must be provided for update",
    });
  }

  const nameValidation = validateBadgeNameForUpdate(name);
  if (!nameValidation.valid) {
    return res.status(400).json({
      success: false,
      message: nameValidation.error,
    });
  }

  const descValidation = validateBadgeDescription(description);
  if (!descValidation.valid) {
    return res.status(400).json({
      success: false,
      message: descValidation.error,
    });
  }

  const catValidation = validateBadgeCategory(category);
  if (!catValidation.valid) {
    return res.status(400).json({
      success: false,
      message: catValidation.error,
    });
  }

  next();
};

export const validateSearchBadgeTemplate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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

export const validatePagination = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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

export const validateTemplateId = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const templateId = parseInt(req.params.templateId || "0");
  if (isNaN(templateId) || templateId <= 0) {
    return res.status(400).json({
      success: false,
      message: "Invalid template ID",
    });
  }
  next();
};

export const validateCategory = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { category } = req.params;
  if (!category || category.trim().length < 2) {
    return res.status(400).json({
      success: false,
      message: "Category must be at least 2 characters long",
    });
  }
  next();
};
