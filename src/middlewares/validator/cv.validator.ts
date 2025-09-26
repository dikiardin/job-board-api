import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

const cvGenerationSchema = Joi.object({
  templateType: Joi.string().valid('ats', 'modern', 'creative').default('ats'),
  additionalInfo: Joi.object({
    objective: Joi.string().max(500).optional(),
    linkedin: Joi.string().max(200).optional(),
    portfolio: Joi.string().max(200).optional(),
    skills: Joi.array().items(Joi.string().max(100)).max(20).optional(),
    skillCategories: Joi.object().pattern(
      Joi.string(),
      Joi.array().items(Joi.string())
    ).optional(),
    languages: Joi.array().items(
      Joi.object({
        name: Joi.string().max(50).required(),
        level: Joi.string().valid('Beginner', 'Intermediate', 'Advanced', 'Native').required()
      })
    ).max(10).optional(),
    workExperience: Joi.array().items(
      Joi.object({
        company: Joi.string().max(100).required(),
        position: Joi.string().max(100).required(),
        startDate: Joi.string().max(20).required(),
        endDate: Joi.string().max(20).required(),
        responsibilities: Joi.array().items(Joi.string().max(300)).max(10).required()
      })
    ).max(10).optional(),
    educationDetails: Joi.array().items(
      Joi.object({
        institution: Joi.string().max(100).required(),
        degree: Joi.string().max(100).required(),
        year: Joi.string().max(20).required(),
        gpa: Joi.string().max(10).optional()
      })
    ).max(10).optional(),
    certifications: Joi.array().items(
      Joi.object({
        name: Joi.string().max(100).required(),
        issuer: Joi.string().max(100).required(),
        date: Joi.string().max(20).required(),
        link: Joi.string().max(300).optional()
      })
    ).max(10).optional(),
    projects: Joi.array().items(
      Joi.object({
        name: Joi.string().max(100).required(),
        description: Joi.string().max(500).required(),
        technologies: Joi.array().items(Joi.string().max(50)).max(10).required(),
        url: Joi.string().max(300).optional()
      })
    ).max(10).optional(),
    references: Joi.array().items(
      Joi.object({
        name: Joi.string().max(100).required(),
        position: Joi.string().max(100).required(),
        company: Joi.string().max(100).required(),
        phone: Joi.string().max(20).required(),
        email: Joi.string().email().required()
      })
    ).max(5).optional()
  }).optional()
});

export const validateCVGeneration = (req: Request, res: Response, next: NextFunction) => {
  const { error, value } = cvGenerationSchema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true
  });

  if (error) {
    const errorMessages = error.details.map((detail: any) => detail.message);
    return res.status(400).json({
      message: 'Validation error',
      errors: errorMessages
    });
  }

  req.body = value;
  next();
};
