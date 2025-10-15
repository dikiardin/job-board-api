import { Request, Response, NextFunction } from "express";
export declare class SkillAssessmentValidator {
    static validateCreateAssessment: (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
    static validateSubmitAssessment: (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
    static validateUpdateAssessment: (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
    static validatePagination: (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
    static validateSaveQuestion: (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
    static validateAssessmentId: (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
    static validateAssessmentSlug: (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
    static validateCertificateCode: (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
    static validateResultId: (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
}
//# sourceMappingURL=skillAssessment.validator.d.ts.map