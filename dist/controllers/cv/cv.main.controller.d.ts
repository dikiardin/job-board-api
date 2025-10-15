import { Response } from "express";
import { AuthRequest } from "../../middlewares/auth.middleware";
export declare class CVMainController {
    generateCV(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    getUserCVs(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    getCVById(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    updateCV(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    deleteCV(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
}
export declare const cvMainController: CVMainController;
//# sourceMappingURL=cv.main.controller.d.ts.map