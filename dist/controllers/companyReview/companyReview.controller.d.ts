import { Request, Response, NextFunction } from "express";
export declare class CompanyReviewController {
    static getCompanyReviews(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getCompanyReviewStats(req: Request, res: Response, next: NextFunction): Promise<void>;
    static createReview(req: Request, res: Response, next: NextFunction): Promise<void>;
    static checkReviewEligibility(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getUserReview(req: Request, res: Response, next: NextFunction): Promise<void>;
    static updateReview(req: Request, res: Response, next: NextFunction): Promise<void>;
    static deleteReview(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getSalaryEstimates(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getCompanyRating(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getCompanyReviewers(req: Request, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=companyReview.controller.d.ts.map