import Joi from "joi";

export class AssessmentValidationSchemas {
  public static createAssessmentSchema = Joi.object({
    title: Joi.string().min(1).required().messages({
      "string.min": "Title is required",
      "any.required": "Title is required",
    }),
    description: Joi.string().optional(),
    category: Joi.string().min(1).required().messages({
      "string.min": "Category is required",
      "any.required": "Category is required",
    }),
    badgeTemplateId: Joi.number().integer().positive().optional().messages({
      "number.positive": "Badge template ID must be a positive number",
    }),
    passScore: Joi.number().integer().min(1).max(100).optional().default(75).messages({
      "number.min": "Pass score must be at least 1%",
      "number.max": "Pass score cannot exceed 100%",
      "number.integer": "Pass score must be a whole number",
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
      .min(1)
      .required()
      .messages({
        "array.min": "At least one question is required",
        "any.required": "Questions are required",
      }),
  });

  public static submitAssessmentSchema = Joi.object({
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
          answer: Joi.string().min(1).required().messages({
            "string.min": "Answer is required",
            "any.required": "Answer is required",
          }),
        })
      )
      .min(0)
      .required()
      .messages({
        "array.min": "Answers array is required",
        "any.required": "Answers are required",
      }),
  });

  public static updateAssessmentSchema = Joi.object({
    title: Joi.string().min(1).optional(),
    description: Joi.string().optional(),
    category: Joi.string().min(1).optional(),
    badgeTemplateId: Joi.number().integer().positive().optional(),
    passScore: Joi.number().integer().min(1).max(100).optional().messages({
      "number.min": "Pass score must be at least 1%",
      "number.max": "Pass score cannot exceed 100%",
      "number.integer": "Pass score must be a whole number",
    }),
    questions: Joi.array()
      .items(
        Joi.object({
          question: Joi.string().min(1).required(),
          options: Joi.array().items(Joi.string().min(1).required()).length(4).required(),
          answer: Joi.string().min(1).required(),
        })
      )
      .min(0)
      .optional(),
  });

  public static paginationSchema = Joi.object({
    page: Joi.number().integer().min(1).optional().default(1),
    limit: Joi.number().integer().min(1).max(100).optional().default(10),
  });

  public static saveQuestionSchema = Joi.object({
    assessmentId: Joi.number().integer().positive().required(),
    question: Joi.string().min(1).required(),
    options: Joi.array().items(Joi.string().min(1).required()).length(4).required(),
    answer: Joi.string().min(1).required(),
  });
}
