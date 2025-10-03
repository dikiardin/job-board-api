import Joi from "joi";
import { Request, Response, NextFunction } from "express";

export class SubscriptionValidator {
  // Subscription creation validation
  public static validateSubscribeRequest = (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const schema = Joi.object({
      planId: Joi.number().integer().positive().required(),
    });

    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        message: "Validation error",
        details: error.details?.[0]?.message || "Invalid request data",
      });
    }

    next();
  };

  // Subscription update validation
  public static validateUpdateRequest = (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const schema = Joi.object({
      isActive: Joi.boolean().optional(),
      startDate: Joi.date().iso().optional(),
      endDate: Joi.date().iso().optional(),
    });

    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        message: "Validation error",
        details: error.details?.[0]?.message || "Invalid request data",
      });
    }

    next();
  };

  // Plan creation validation
  public static validatePlanCreation = (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const schema = Joi.object({
      planName: Joi.string().min(3).max(50).required(),
      planPrice: Joi.number().positive().required(),
      planDescription: Joi.string().min(10).max(500).required(),
    });

    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        message: "Validation error",
        details: error.details?.[0]?.message || "Invalid request data",
      });
    }

    next();
  };

  // Plan update validation
  public static validatePlanUpdate = (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const schema = Joi.object({
      planName: Joi.string().min(3).max(50).optional(),
      planPrice: Joi.number().positive().optional(),
      planDescription: Joi.string().min(10).max(500).optional(),
    });

    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        message: "Validation error",
        details: error.details?.[0]?.message || "Invalid request data",
      });
    }

    next();
  };
}
