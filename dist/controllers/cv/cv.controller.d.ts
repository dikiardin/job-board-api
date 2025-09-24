import { Request, Response } from "express";
import { AuthRequest } from "../../middlewares/auth.middleware";
export declare class CVController {
    generateCV(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    getUserCVs(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    getCVById(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    deleteCV(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    downloadCV(req: AuthRequest, res: Response): Promise<void | Response<any, Record<string, any>>>;
    publicDownloadCV(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    getTemplates(req: AuthRequest, res: Response): Promise<void>;
}
export declare const cvController: CVController;
//# sourceMappingURL=cv.controller.d.ts.map