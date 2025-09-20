import { NextFunction, Request, Response } from "express";
import { SubscriptionService } from "../../services/subscription/subscription.service";

export class SubscriptionController {
  public static async getAllSubscriptions(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const subscriptions = await SubscriptionService.getAllSubscriptions();
      res.status(200).json(subscriptions);
    } catch (error) {
      next(error);
    }
  }

  public static async getSubscriptionById(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params;
      const subscription = await SubscriptionService.getSubscriptionById(
        parseInt(id!)
      );
      res.status(200).json(subscription);
    } catch (error) {
      next(error);
    }
  }

  public static async getUserSubscriptions(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = parseInt(res.locals.decrypt.userId);
      const subscriptions = await SubscriptionService.getUserSubscriptions(
        userId
      );
      res.status(200).json(subscriptions);
    } catch (error) {
      next(error);
    }
  }

  public static async getUserActiveSubscription(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = parseInt(res.locals.decrypt.userId);
      const subscription = await SubscriptionService.getUserActiveSubscription(
        userId
      );
      res.status(200).json(subscription);
    } catch (error) {
      next(error);
    }
  }

  public static async subscribe(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = parseInt(res.locals.decrypt.userId);
      const { planId } = req.body;

      if (!planId) {
        return res.status(400).json({ message: "Plan ID is required" });
      }

      const result = await SubscriptionService.subscribeUser(
        userId,
        parseInt(planId)
      );

      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  public static async updateSubscription(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params;
      const { isActive, startDate, endDate } = req.body;

      const updateData: {
        isActive?: boolean;
        startDate?: Date;
        endDate?: Date;
      } = {};

      if (isActive !== undefined) updateData.isActive = isActive;
      if (startDate) updateData.startDate = new Date(startDate);
      if (endDate) updateData.endDate = new Date(endDate);

      const subscription = await SubscriptionService.updateSubscription(
        parseInt(id!),
        updateData
      );

      res.status(200).json(subscription);
    } catch (error) {
      next(error);
    }
  }
}
