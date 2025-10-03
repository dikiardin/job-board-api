import { NextFunction, Request, Response } from "express";
import { PlanService } from "../../services/subscription/plan.service";
import { ControllerHelper } from "../../utils/controllerHelper";

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
      const id = ControllerHelper.parseId(req.params.id);
      const plan = await PlanService.getPlanById(id);
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
      
      ControllerHelper.validateRequired(
        { planName, planPrice, planDescription },
        "Plan name, price, and description are required"
      );

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
      const id = ControllerHelper.parseId(req.params.id);
      const updateData = ControllerHelper.buildUpdateData(req.body, [
        'planName', 'planPrice', 'planDescription'
      ]);
      
      if (updateData.planPrice) {
        updateData.planPrice = parseFloat(updateData.planPrice);
      }

      const plan = await PlanService.updatePlan(id, updateData);
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
      const id = ControllerHelper.parseId(req.params.id);
      await PlanService.deletePlan(id);
      res.status(200).json({ message: "Subscription plan deleted successfully" });
    } catch (error) {
      next(error);
    }
  }
}
