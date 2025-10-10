import { Request, Response, NextFunction } from "express";
import Joi from "joi";

const createManySchema = Joi.object({
  items: Joi.array().items(Joi.object({
    applicantId: Joi.number().integer().required(),
    scheduleDate: Joi.date().iso().required(),
    locationOrLink: Joi.string().allow(null, '').optional(),
    notes: Joi.string().allow(null, '').max(500).optional(),
  })).min(1).max(50).required(),
});

export function validateCreateManyInterviews(req: Request, res: Response, next: NextFunction) {
  const { error, value } = createManySchema.validate(req.body, { abortEarly: false, stripUnknown: true });
  if (error) return res.status(400).json({ message: "Invalid body", errors: error.details.map((d) => d.message) });
  req.body = value;
  next();
}

const updateSchema = Joi.object({
  scheduleDate: Joi.date().iso().optional(),
  locationOrLink: Joi.string().allow(null, '').optional(),
  notes: Joi.string().allow(null, '').max(500).optional(),
  status: Joi.string().valid('SCHEDULED','COMPLETED','CANCELLED','NO_SHOW').optional(),
}).or('scheduleDate','locationOrLink','notes','status');

export function validateUpdateInterview(req: Request, res: Response, next: NextFunction) {
  const { error, value } = updateSchema.validate(req.body, { abortEarly: false, stripUnknown: true });
  if (error) return res.status(400).json({ message: "Invalid body", errors: error.details.map((d) => d.message) });
  req.body = value;
  next();
}


