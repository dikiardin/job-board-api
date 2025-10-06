import { Request, Response } from "express";

export class ControllerHelper {
  public static getUserId(res: Response): number {
    return res.locals.decrypt.userId;
  }

  public static getCompanyId(req: Request): string {
    return req.params.companyId as string;
  }

  public static getPaginationParams(req: Request) {
    return {
      page: parseInt((req.query.page as string) || '1'),
      limit: parseInt((req.query.limit as string) || '10'),
      sortBy: (req.query.sortBy as string) || 'createdAt',
      sortOrder: (req.query.sortOrder as string) || 'desc'
    };
  }

  public static sendSuccessResponse(res: Response, message: string, data?: any, statusCode = 200) {
    res.status(statusCode).json({
      success: true,
      message,
      data
    });
  }

  public static sendDeleteResponse(res: Response, message: string) {
    res.status(200).json({
      success: true,
      message
    });
  }
}
