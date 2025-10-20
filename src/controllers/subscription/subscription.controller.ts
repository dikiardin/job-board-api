import { NextFunction, Request, Response } from "express";
import { SubscriptionService } from "../../services/subscription/subscription.service";
import { SubscriptionRenewalService } from "../../services/subscription/subscriptionRenewal.service";
import { ControllerHelper } from "../../utils/controllerHelper";

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
      const id = ControllerHelper.parseId(req.params.id);
      const subscription = await SubscriptionService.getSubscriptionById(id);
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
      const userId = ControllerHelper.getUserId(res);
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
      const userId = ControllerHelper.getUserId(res);
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
      const userId = ControllerHelper.getUserId(res);
      const { planId } = req.body;

      ControllerHelper.validateRequired({ planId }, "Plan ID is required");

      // Ensure planId is integer
      const parsedPlanId =
        typeof planId === "string" ? parseInt(planId) : planId;
      if (isNaN(parsedPlanId)) {
        throw new Error("Invalid plan ID format");
      }

      const result = await SubscriptionService.subscribeUser(
        userId,
        parsedPlanId
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
      const id = ControllerHelper.parseId(req.params.id);
      const updateData = ControllerHelper.buildUpdateData(req.body, [
        "isActive",
        "startDate",
        "endDate",
      ]);

      const subscription = await SubscriptionService.updateSubscription(
        id,
        updateData
      );
      res.status(200).json(subscription);
    } catch (error) {
      next(error);
    }
  }

  public static async renewSubscription(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      console.log("=== CONTROLLER: RENEW SUBSCRIPTION ===");
      const userId = ControllerHelper.getUserId(res);
      const planId = req.body.planId
        ? ControllerHelper.parseId(req.body.planId)
        : undefined;

      console.log("Controller - User ID:", userId);
      console.log("Controller - Plan ID:", planId);

      const result = await SubscriptionRenewalService.renewSubscription(
        userId,
        planId
      );
      res.status(200).json(result);
    } catch (error) {
      console.error("Controller error:", error);
      next(error);
    }
  }

  public static async getRenewalInfo(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      console.log("=== CONTROLLER: GET RENEWAL INFO ===");
      const userId = ControllerHelper.getUserId(res);
      console.log("Controller - User ID:", userId);

      const renewalInfo = await SubscriptionRenewalService.getRenewalInfo(
        userId
      );
      console.log("Controller - Renewal info retrieved");
      res.status(200).json(renewalInfo);
    } catch (error) {
      console.error("Controller error:", error);
      next(error);
    }
  }
}
