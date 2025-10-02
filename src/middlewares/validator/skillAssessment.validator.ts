import { Request, Response, NextFunction } from "express";
import Joi from "joi";

// Validation schemas
const createAssessmentSchema = Joi.object({
  title: Joi.string().min(1).required().messages({
    "string.min": "Title is required",
    "any.required": "Title is required",
  }),
  description: Joi.string().optional(),
  badgeTemplateId: Joi.number().integer().positive().optional().messages({
    "number.positive": "Badge template ID must be a positive number",
  }),
  questions: Joi.array()
    .items(
      Joi.object({
        question: Joi.string().min(1).required().messages({
          "string.min": "Question text is required",
          "any.required": "Question text is required",
        }),
        options: Joi.array()
          .items(Joi.string().min(1).required())
          .length(4)
          .required()
          .messages({
            "array.length": "Each question must have exactly 4 options",
            "any.required": "Options are required",
          }),
        answer: Joi.string().min(1).required().messages({
          "any.required": "Correct answer is required",
        }),
      })
    )
    .min(0)
    .required()
    .messages({
      "array.min": "Questions array is required",
      "any.required": "Questions are required",
    }),
});

const submitAssessmentSchema = Joi.object({
  startedAt: Joi.string().isoDate().required().messages({
    "string.isoDate": "Started time must be a valid ISO date",
    "any.required": "Started time is required",
  }),
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
    .min(1)
    .max(25)
    .required()
    .messages({
      "array.min": "At least 1 answer is required",
      "array.max": "Maximum 25 answers allowed",
      "any.required": "Answers are required",
    }),
});

const updateAssessmentSchema = Joi.object({
  title: Joi.string().min(1).optional().messages({
    "string.min": "Title is required",
  }),
  description: Joi.string().optional(),
  badgeTemplateId: Joi.number().integer().positive().optional().allow(null).messages({
    "number.positive": "Badge template ID must be a positive number",
  }),
  questions: Joi.array()
    .items(
      Joi.object({
        question: Joi.string().min(1).required().messages({
          "string.min": "Question text is required",
          "any.required": "Question text is required",
        }),
        options: Joi.array()
          .items(Joi.string().min(1).required())
          .length(4)
          .required()
          .messages({
            "array.length": "Each question must have exactly 4 options",
            "any.required": "Options are required",
          }),
        answer: Joi.string().min(1).required().messages({
          "any.required": "Correct answer is required",
        }),
      })
    )
    .min(0)
    .optional()
    .messages({
      "array.min": "Questions array is required",
    }),
}).min(1).messages({
  "object.min": "At least one field (title, description, badgeTemplateId, or questions) must be provided",
});

const saveQuestionSchema = Joi.object({
  assessmentId: Joi.number().integer().positive().required().messages({
    "number.positive": "Assessment ID must be a positive number",
    "any.required": "Assessment ID is required",
  }),
  question: Joi.string().min(1).required().messages({
    "string.min": "Question text is required",
    "any.required": "Question text is required",
  }),
  options: Joi.array()
    .items(Joi.string().min(1).required())
    .length(4)
    .required()
    .messages({
      "array.length": "Each question must have exactly 4 options",
      "any.required": "Options are required",
    }),
  answer: Joi.string().min(1).required().messages({
    "any.required": "Correct answer is required",
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

export const validateSaveQuestion = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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
