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

  // Platform-wide analytics controllers (no companyId needed)
  static async platformDemographics(req: Request, res: Response, next: NextFunction) {
    try {
      // Temporarily bypass authentication for testing
      const data = await AnalyticsService.demographics({
        companyId: 0, // Not used for platform-wide
        requesterId: 1, // Dummy admin ID
        requesterRole: UserRole.ADMIN,
        query: req.query as any,
      });
      res.status(200).json({ success: true, data });
    } catch (error) {
      console.error('Platform demographics error:', error);
      next(error);
    }
  }

  static async platformSalaryTrends(req: Request, res: Response, next: NextFunction) {
    try {
      const requester = res.locals.decrypt as { userId: number; role: UserRole };
      const data = await AnalyticsService.salaryTrends({
        companyId: 0, // Not used for platform-wide
        requesterId: requester.userId,
        requesterRole: requester.role,
        query: req.query as any,
      });
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  static async platformInterests(req: Request, res: Response, next: NextFunction) {
    try {
      const requester = res.locals.decrypt as { userId: number; role: UserRole };
      const data = await AnalyticsService.interests({
        companyId: 0, // Not used for platform-wide
        requesterId: requester.userId,
        requesterRole: requester.role,
        query: req.query as any,
      });
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  static async platformOverview(req: Request, res: Response, next: NextFunction) {
    try {
      const requester = res.locals.decrypt as { userId: number; role: UserRole };
      const data = await AnalyticsService.overview({
        companyId: 0, // Not used for platform-wide
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
