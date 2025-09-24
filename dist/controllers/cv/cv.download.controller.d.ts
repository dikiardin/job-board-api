import { Request, Response } from "express";
import { AuthRequest } from "../../middlewares/auth.middleware";
export declare class CVDownloadController {
    downloadCV(req: AuthRequest, res: Response): Promise<void | Response<any, Record<string, any>>>;
    publicDownloadCV(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    getTemplates(req: AuthRequest, res: Response): Promise<void>;
}
export declare const cvDownloadController: CVDownloadController;
//# sourceMappingURL=cv.download.controller.d.ts.map