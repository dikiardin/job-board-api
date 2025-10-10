import { Request, Response, NextFunction } from "express";
import { AnalyticsService } from "../../services/analytics/analytics.service";
import { UserRole } from "../../generated/prisma";

export class AnalyticsController {
  static async demographics(req: Request, res: Response, next: NextFunction) {
    try {
      const companyId = req.params.companyId as string;
      const requester = res.locals.decrypt as { userId: number; role: UserRole };
      const data = await AnalyticsService.demographics({
        companyId,
        requesterId: requester.userId,
        requesterRole: requester.role,
        query: req.query as any,
      });
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  static async salaryTrends(req: Request, res: Response, next: NextFunction) {
    try {
      const companyId = req.params.companyId as string;
      const requester = res.locals.decrypt as { userId: number; role: UserRole };
      const data = await AnalyticsService.salaryTrends({
        companyId,
        requesterId: requester.userId,
        requesterRole: requester.role,
        query: req.query as any,
      });
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  static async interests(req: Request, res: Response, next: NextFunction) {
    try {
      const companyId = req.params.companyId as string;
      const requester = res.locals.decrypt as { userId: number; role: UserRole };
      const data = await AnalyticsService.interests({
        companyId,
        requesterId: requester.userId,
        requesterRole: requester.role,
        query: req.query as any,
      });
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  static async overview(req: Request, res: Response, next: NextFunction) {
    try {
      const companyId = req.params.companyId as string;
      const requester = res.locals.decrypt as { userId: number; role: UserRole };
      const data = await AnalyticsService.overview({
        companyId,
        requesterId: requester.userId,
        requesterRole: requester.role,
        query: req.query as any,
      });
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  static async engagement(req: Request, res: Response, next: NextFunction) {
    try {
      const companyId = req.params.companyId as string;
      const requester = res.locals.decrypt as { userId: number; role: UserRole };
      const data = await AnalyticsService.engagement({
        companyId,
        requesterId: requester.userId,
        requesterRole: requester.role,
        query: req.query as any,
      });
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  static async conversionFunnel(req: Request, res: Response, next: NextFunction) {
    try {
      const companyId = req.params.companyId as string;
      const requester = res.locals.decrypt as { userId: number; role: UserRole };
      const data = await AnalyticsService.conversionFunnel({
        companyId,
        requesterId: requester.userId,
        requesterRole: requester.role,
        query: req.query as any,
      });
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  static async retention(req: Request, res: Response, next: NextFunction) {
    try {
      const companyId = req.params.companyId as string;
      const requester = res.locals.decrypt as { userId: number; role: UserRole };
      const data = await AnalyticsService.retention({
        companyId,
        requesterId: requester.userId,
        requesterRole: requester.role,
        query: req.query as any,
      });
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  static async performance(req: Request, res: Response, next: NextFunction) {
    try {
      const companyId = req.params.companyId as string;
      const requester = res.locals.decrypt as { userId: number; role: UserRole };
      const data = await AnalyticsService.performance({
        companyId,
        requesterId: requester.userId,
        requesterRole: requester.role,
        query: req.query as any,
      });
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }
}
