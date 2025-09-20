import { NextFunction, Request, Response } from "express";
import { PlanService } from "../../services/subscription/plan.service";

export class PlanController {
  public static async getAllPlans(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const plans = await PlanService.getAllPlans();
      res.status(200).json(plans);
    } catch (error) {
      next(error);
    }
  }

  public static async getPlanById(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params;
      const plan = await PlanService.getPlanById(parseInt(id!));
      res.status(200).json(plan);
    } catch (error) {
      next(error);
    }
  }

  public static async createPlan(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { planName, planPrice, planDescription } = req.body;

      if (!planName || !planPrice || !planDescription) {
        return res
          .status(400)
          .json({ message: "Plan name, price, and description are required" });
      }

      const plan = await PlanService.createPlan({
        planName,
        planPrice: parseFloat(planPrice),
        planDescription,
      });

      res.status(201).json(plan);
    } catch (error) {
      next(error);
    }
  }

  public static async updatePlan(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params;
      const { planName, planPrice, planDescription } = req.body;

      const updateData: {
        planName?: string;
        planPrice?: number;
        planDescription?: string;
      } = {};

      if (planName) updateData.planName = planName;
      if (planPrice) updateData.planPrice = parseFloat(planPrice);
      if (planDescription) updateData.planDescription = planDescription;

      const plan = await PlanService.updatePlan(
        parseInt(id!),
        updateData
      );

      res.status(200).json(plan);
    } catch (error) {
      next(error);
    }
  }

  public static async deletePlan(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params;
      await PlanService.deletePlan(parseInt(id!));

      res
        .status(200)
        .json({ message: "Subscription plan deleted successfully" });
    } catch (error) {
      next(error);
    }
  }
}
