import { Request, Response, NextFunction } from "express";
import Joi from "joi";

// Validation schemas
const createAssessmentSchema = Joi.object({
  title: Joi.string().min(3).max(100).required().messages({
    "string.min": "Title must be at least 3 characters long",
    "string.max": "Title must not exceed 100 characters",
    "any.required": "Title is required",
  }),
  description: Joi.string().max(500).optional().messages({
    "string.max": "Description must not exceed 500 characters",
  }),
  badgeTemplateId: Joi.number().integer().positive().optional().messages({
    "number.positive": "Badge template ID must be a positive number",
  }),
  questions: Joi.array()
    .items(
      Joi.object({
        question: Joi.string().min(5).max(500).required().messages({
          "string.min": "Question must be at least 5 characters long",
          "string.max": "Question must not exceed 500 characters",
          "any.required": "Question text is required",
        }),
        options: Joi.array()
          .items(Joi.string().min(1).max(200))
          .length(4)
          .required()
          .messages({
            "array.length": "Each question must have exactly 4 options",
            "any.required": "Options are required",
          }),
        answer: Joi.string().min(1).max(200).required().messages({
          "any.required": "Correct answer is required",
        }),
      })
    )
    .min(1)
    .required()
    .messages({
      "array.min": "Assessment must have at least 1 question",
      "any.required": "Questions are required",
    }),
});

const submitAssessmentSchema = Joi.object({
  answers: Joi.array()
    .items(
      Joi.object({
        questionId: Joi.number().integer().positive().required().messages({
          "number.positive": "Question ID must be a positive number",
          "any.required": "Question ID is required",
        }),
        selectedAnswer: Joi.string().min(1).max(200).required().messages({
          "any.required": "Selected answer is required",
        }),
      })
    )
    .length(25)
    .required()
    .messages({
      "array.length": "All 25 questions must be answered",
      "any.required": "Answers are required",
    }),
});

const updateAssessmentSchema = Joi.object({
  title: Joi.string().min(3).max(100).optional().messages({
    "string.min": "Title must be at least 3 characters long",
    "string.max": "Title must not exceed 100 characters",
  }),
  description: Joi.string().max(500).optional().messages({
    "string.max": "Description must not exceed 500 characters",
  }),
  badgeTemplateId: Joi.number().integer().positive().optional().allow(null).messages({
    "number.positive": "Badge template ID must be a positive number",
  }),
  questions: Joi.array()
    .items(
      Joi.object({
        question: Joi.string().min(5).max(500).required().messages({
          "string.min": "Question must be at least 5 characters long",
          "string.max": "Question must not exceed 500 characters",
          "any.required": "Question text is required",
        }),
        options: Joi.array()
          .items(Joi.string().min(1).max(200))
          .length(4)
          .required()
          .messages({
            "array.length": "Each question must have exactly 4 options",
            "any.required": "Options are required",
          }),
        answer: Joi.string().min(1).max(200).required().messages({
          "any.required": "Correct answer is required",
        }),
      })
    )
    .min(1)
    .optional()
    .messages({
      "array.min": "Assessment must have at least 1 question",
    }),
}).min(1).messages({
  "object.min": "At least one field (title, description, badgeTemplateId, or questions) must be provided",
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

// Validation middleware functions
export const validateCreateAssessment = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { error } = createAssessmentSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: "Validation error",
      errors: error.details.map((detail) => detail.message),
    });
  }

  // Additional validation: check if answer is one of the options
  for (let i = 0; i < req.body.questions.length; i++) {
    const question = req.body.questions[i];
    if (!question.options.includes(question.answer)) {
      return res.status(400).json({
        success: false,
        message: `Question ${i + 1}: Answer must be one of the provided options`,
      });
    }
  }

  next();
};

export const validateSubmitAssessment = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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

  // Check if time difference is reasonable (not more than 35 minutes to account for network delays)
  const timeDiff = now.getTime() - startedAt.getTime();
  const minutesDiff = timeDiff / (1000 * 60);
  if (minutesDiff > 35) {
    return res.status(400).json({
      success: false,
      message: "Assessment submission time exceeded maximum allowed duration",
    });
  }

  next();
};

export const validateUpdateAssessment = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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

export const validateAssessmentId = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const assessmentId = parseInt(req.params.assessmentId || '0');
  if (isNaN(assessmentId) || assessmentId <= 0) {
    return res.status(400).json({
      success: false,
      message: "Invalid assessment ID",
    });
  }
  next();
};

export const validateCertificateCode = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { certificateCode } = req.params;
  if (!certificateCode || certificateCode.length < 5) {
    return res.status(400).json({
      success: false,
      message: "Valid certificate code is required",
    });
  }
  next();
};

export const validateResultId = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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
