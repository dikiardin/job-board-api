import { Request, Response, NextFunction } from "express";
import Joi from "joi";

const listJobsQuerySchema = Joi.object({
  title: Joi.string().trim().max(100).optional(),
  category: Joi.string().trim().max(50).optional(),
  city: Joi.string().trim().max(50).optional(),
  sortBy: Joi.string().valid("createdAt", "deadline").optional(),
  sortOrder: Joi.string().valid("asc", "desc").optional(),
  limit: Joi.number().integer().min(1).max(100).default(10).optional(),
  offset: Joi.number().integer().min(0).default(0).optional(),
});

export function validateListJobs(req: Request, res: Response, next: NextFunction) {
  const { error, value } = listJobsQuerySchema.validate(req.query, { abortEarly: false, stripUnknown: true });
  if (error) return res.status(400).json({ message: "Invalid query", errors: error.details.map((d) => d.message) });
  // Store validated query in res.locals instead of modifying req.query
  res.locals.validatedQuery = value;
  next();
}

const applicantsListQuerySchema = Joi.object({
  name: Joi.string().trim().optional(),
  education: Joi.string().trim().optional(),
  ageMin: Joi.number().integer().min(0).optional(),
  ageMax: Joi.number().integer().min(0).optional(),
  expectedSalaryMin: Joi.number().integer().min(0).optional(),
  expectedSalaryMax: Joi.number().integer().min(0).optional(),
  sortBy: Joi.string().valid("appliedAt", "expectedSalary", "age").optional(),
  sortOrder: Joi.string().valid("asc", "desc").optional(),
  limit: Joi.number().integer().min(1).max(100).optional(),
  offset: Joi.number().integer().min(0).optional(),
});

export function validateApplicantsList(req: Request, res: Response, next: NextFunction) {
  const { error, value } = applicantsListQuerySchema.validate(req.query, { abortEarly: false, stripUnknown: true });
  if (error) return res.status(400).json({ message: "Invalid query", errors: error.details.map((d) => d.message) });
  res.locals.validatedQuery = value;
  next();
}

const updateApplicantStatusBody = Joi.object({
  status: Joi.string().valid("IN_REVIEW", "INTERVIEW", "ACCEPTED", "REJECTED").required(),
  reviewNote: Joi.string().allow(null, '').max(500).optional(),
});

export function validateUpdateApplicantStatus(req: Request, res: Response, next: NextFunction) {
  const { error, value } = updateApplicantStatusBody.validate(req.body, { abortEarly: false, stripUnknown: true });
  if (error) return res.status(400).json({ message: "Invalid body", errors: error.details.map((d) => d.message) });
  req.body = value;
  next();
}


