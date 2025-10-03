import { Request, Response, NextFunction } from "express";
import { AssessmentValidationSchemas } from "../../utils/assessmentValidationSchemas";

export class SkillAssessmentValidator {
  public static validateCreateAssessment = (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { error } = AssessmentValidationSchemas.createAssessmentSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        message: "Validation error",
        details: error.details?.[0]?.message || "Invalid request data",
      });
    }
    next();
  };

  public static validateSubmitAssessment = (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { error } = AssessmentValidationSchemas.submitAssessmentSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        message: "Validation error",
        details: error.details?.[0]?.message || "Invalid request data",
      });
    }
    next();
  };

  public static validateUpdateAssessment = (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { error } = AssessmentValidationSchemas.updateAssessmentSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        message: "Validation error",
        details: error.details?.[0]?.message || "Invalid request data",
      });
    }
    next();
  };

  public static validatePagination = (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { error } = AssessmentValidationSchemas.paginationSchema.validate(req.query);
    if (error) {
      return res.status(400).json({
        message: "Validation error",
        details: error.details?.[0]?.message || "Invalid request data",
      });
    }
    next();
  };

  public static validateSaveQuestion = (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { error } = AssessmentValidationSchemas.saveQuestionSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        message: "Validation error",
        details: error.details?.[0]?.message || "Invalid request data",
      });
    }
    next();
  };

  public static validateAssessmentId = (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { assessmentId } = req.params;
    if (!assessmentId || isNaN(parseInt(assessmentId))) {
      return res.status(400).json({
        message: "Validation error",
        details: "Valid assessment ID is required",
      });
    }
    next();
  };

  public static validateCertificateCode = (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { certificateCode } = req.params;
    if (!certificateCode || certificateCode.trim().length === 0) {
      return res.status(400).json({
        message: "Validation error",
        details: "Certificate code is required",
      });
    }
    next();
  };

  public static validateResultId = (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { resultId } = req.params;
    if (!resultId || isNaN(parseInt(resultId))) {
      return res.status(400).json({
        message: "Validation error",
        details: "Valid result ID is required",
      });
    }
    next();
  };
}
