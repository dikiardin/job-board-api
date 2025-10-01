import { Request, Response, NextFunction } from "express";
import Joi from "joi";

// Validation schemas
const createBadgeTemplateSchema = Joi.object({
  name: Joi.string().min(3).max(50).required().messages({
    "string.min": "Badge name must be at least 3 characters long",
    "string.max": "Badge name must not exceed 50 characters",
    "any.required": "Badge name is required",
  }),
  icon: Joi.string().max(10).optional().messages({
    "string.max": "Badge icon must not exceed 10 characters",
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
  icon: Joi.string().max(10).optional().allow("").messages({
    "string.max": "Badge icon must not exceed 10 characters",
  }),
  description: Joi.string().max(200).optional().allow("").messages({
    "string.max": "Description must not exceed 200 characters",
  }),
  category: Joi.string().max(30).optional().allow("").messages({
    "string.max": "Category must not exceed 30 characters",
  }),
}).min(1).messages({
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
  // Debug: Log request body and file
  console.log('Request body:', req.body);
  console.log('Request file:', req.file);
  
  // Manual validation for form-data fields - handle potential key spacing issues
  const bodyKeys = Object.keys(req.body);
  console.log('Available body keys:', bodyKeys);
  
  // Find name field (handle potential spacing issues)
  const nameKey = bodyKeys.find(key => key.trim() === 'name') || 'name';
  const descKey = bodyKeys.find(key => key.trim() === 'description') || 'description';
  const catKey = bodyKeys.find(key => key.trim() === 'category') || 'category';
  
  const name = req.body[nameKey];
  const description = req.body[descKey];
  const category = req.body[catKey];

  console.log('Extracted values:', { name, description, category });

  // Validate required fields
  if (!name || typeof name !== 'string' || name.trim().length < 3) {
    console.log('Name validation failed:', { name, type: typeof name, nameKey });
    return res.status(400).json({
      success: false,
      message: "Badge name is required and must be at least 3 characters long",
      debug: { receivedName: name, nameType: typeof name, availableKeys: bodyKeys }
    });
  }

  if (name.trim().length > 50) {
    return res.status(400).json({
      success: false,
      message: "Badge name must not exceed 50 characters",
    });
  }

  // Validate optional description
  if (description && (typeof description !== 'string' || description.length > 200)) {
    return res.status(400).json({
      success: false,
      message: "Description must not exceed 200 characters",
    });
  }

  // Validate optional category
  if (category && (typeof category !== 'string' || category.length > 30)) {
    return res.status(400).json({
      success: false,
      message: "Category must not exceed 30 characters",
    });
  }

  // Validate file upload
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "Badge icon image is required",
    });
  }

  next();
};

export const validateUpdateBadgeTemplate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Manual validation for form-data fields
  const { name, description, category } = req.body;

  // Check if at least one field is provided (name, description, category, or file)
  if (!name && !description && !category && !req.file) {
    return res.status(400).json({
      success: false,
      message: "At least one field (name, description, category, or icon) must be provided for update",
    });
  }

  // Validate name if provided
  if (name && (typeof name !== 'string' || name.trim().length < 3 || name.trim().length > 50)) {
    return res.status(400).json({
      success: false,
      message: "Badge name must be between 3 and 50 characters long",
    });
  }

  // Validate description if provided
  if (description && (typeof description !== 'string' || description.length > 200)) {
    return res.status(400).json({
      success: false,
      message: "Description must not exceed 200 characters",
    });
  }

  // Validate category if provided
  if (category && (typeof category !== 'string' || category.length > 30)) {
    return res.status(400).json({
      success: false,
      message: "Category must not exceed 30 characters",
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
  const templateId = parseInt(req.params.templateId || '0');
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
