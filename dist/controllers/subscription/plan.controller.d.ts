import { NextFunction, Request, Response } from "express";
export declare class PlanController {
    static getAllPlans(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getPlanById(req: Request, res: Response, next: NextFunction): Promise<void>;
    static createPlan(req: Request, res: Response, next: NextFunction): Promise<void>;
    static updatePlan(req: Request, res: Response, next: NextFunction): Promise<void>;
    static deletePlan(req: Request, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=plan.controller.d.ts.map