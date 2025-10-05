import Joi from "joi";
import { Request, Response, NextFunction } from "express";
import { CustomError } from "../../utils/customError";

// Validation schema for creating/updating a review
const createReviewSchema = Joi.object({
  positionTitle: Joi.string()
    .min(2)
    .max(100)
    .required()
    .messages({
      'string.empty': 'Position title is required',
      'string.min': 'Position title must be at least 2 characters long',
      'string.max': 'Position title must not exceed 100 characters',
      'any.required': 'Position title is required'
    }),
  
  salaryEstimateMin: Joi.number()
    .positive()
    .max(1000000000) // Maximum 1 billion IDR
    .optional()
    .allow(null)
    .messages({
      'number.base': 'Minimum salary estimate must be a number',
      'number.positive': 'Minimum salary estimate must be positive',
      'number.max': 'Minimum salary estimate must not exceed 1,000,000,000 IDR'
    }),
  
  salaryEstimateMax: Joi.number()
    .positive()
    .max(1000000000) // Maximum 1 billion IDR
    .optional()
    .allow(null)
    .messages({
      'number.base': 'Maximum salary estimate must be a number',
      'number.positive': 'Maximum salary estimate must be positive',
      'number.max': 'Maximum salary estimate must not exceed 1,000,000,000 IDR'
    }),
  
  ratingCulture: Joi.number()
    .min(0.1)
    .max(5)
    .precision(1)
    .required()
    .messages({
      'number.base': 'Culture rating must be a number',
      'number.min': 'Culture rating must be at least 0.1',
      'number.max': 'Culture rating must not exceed 5',
      'any.required': 'Culture rating is required'
    }),
  
  ratingWorkLife: Joi.number()
    .min(0.1)
    .max(5)
    .precision(1)
    .required()
    .messages({
      'number.base': 'Work-life balance rating must be a number',
      'number.min': 'Work-life balance rating must be at least 0.1',
      'number.max': 'Work-life balance rating must not exceed 5',
      'any.required': 'Work-life balance rating is required'
    }),
  
  ratingFacilities: Joi.number()
    .min(0.1)
    .max(5)
    .precision(1)
    .required()
    .messages({
      'number.base': 'Facility rating must be a number',
      'number.min': 'Facility rating must be at least 0.1',
      'number.max': 'Facility rating must not exceed 5',
      'any.required': 'Facility rating is required'
    }),
  
  ratingCareer: Joi.number()
    .min(0.1)
    .max(5)
    .precision(1)
    .required()
    .messages({
      'number.base': 'Career opportunity rating must be a number',
      'number.min': 'Career opportunity rating must be at least 0.1',
      'number.max': 'Career opportunity rating must not exceed 5',
      'any.required': 'Career opportunity rating is required'
    }),
  
  body: Joi.string()
    .max(1000)
    .optional()
    .allow('')
    .messages({
      'string.max': 'Review content must not exceed 1000 characters'
    })
});

// Validation schema for getting reviews (query parameters)
const getReviewsSchema = Joi.object({
  page: Joi.number()
    .integer()
    .min(1)
    .optional()
    .default(1)
    .messages({
      'number.base': 'Page must be a number',
      'number.integer': 'Page must be an integer',
      'number.min': 'Page must be at least 1'
    }),
  
  limit: Joi.number()
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
  
  sortBy: Joi.string()
    .valid('createdAt', 'rating')
    .optional()
    .default('createdAt')
    .messages({
      'any.only': 'Sort by must be either "createdAt" or "rating"'
    }),
  
  sortOrder: Joi.string()
    .valid('asc', 'desc')
    .optional()
    .default('desc')
    .messages({
      'any.only': 'Sort order must be either "asc" or "desc"'
    })
});

// Middleware to validate create/update review data
export const validateCreateReview = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { error, value } = createReviewSchema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true
  });

  if (error) {
    const errorMessages = error.details.map(detail => detail.message);
    throw new CustomError(errorMessages.join(', '), 400);
  }

  req.body = value;
  next();
};

// Middleware to validate get reviews query parameters
export const validateGetReviews = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { error, value } = getReviewsSchema.validate(req.query, {
    abortEarly: false,
    stripUnknown: true
  });

  if (error) {
    const errorMessages = error.details.map(detail => detail.message);
    throw new CustomError(errorMessages.join(', '), 400);
  }

  // Update query parameters with validated values
  Object.assign(req.query, value);
  next();
};
