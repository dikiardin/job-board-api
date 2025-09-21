"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlanController = void 0;
const plan_service_1 = require("../../services/subscription/plan.service");
class PlanController {
    static async getAllPlans(req, res, next) {
        try {
            const plans = await plan_service_1.PlanService.getAllPlans();
            res.status(200).json(plans);
        }
        catch (error) {
            next(error);
        }
    }
    static async getPlanById(req, res, next) {
        try {
            const { id } = req.params;
            const plan = await plan_service_1.PlanService.getPlanById(parseInt(id));
            res.status(200).json(plan);
        }
        catch (error) {
            next(error);
        }
    }
    static async createPlan(req, res, next) {
        try {
            const { planName, planPrice, planDescription } = req.body;
            if (!planName || !planPrice || !planDescription) {
                return res
                    .status(400)
                    .json({ message: "Plan name, price, and description are required" });
            }
            const plan = await plan_service_1.PlanService.createPlan({
                planName,
                planPrice: parseFloat(planPrice),
                planDescription,
            });
            res.status(201).json(plan);
        }
        catch (error) {
            next(error);
        }
    }
    static async updatePlan(req, res, next) {
        try {
            const { id } = req.params;
            const { planName, planPrice, planDescription } = req.body;
            const updateData = {};
            if (planName)
                updateData.planName = planName;
            if (planPrice)
                updateData.planPrice = parseFloat(planPrice);
            if (planDescription)
                updateData.planDescription = planDescription;
            const plan = await plan_service_1.PlanService.updatePlan(parseInt(id), updateData);
            res.status(200).json(plan);
        }
        catch (error) {
            next(error);
        }
    }
    static async deletePlan(req, res, next) {
        try {
            const { id } = req.params;
            await plan_service_1.PlanService.deletePlan(parseInt(id));
            res
                .status(200)
                .json({ message: "Subscription plan deleted successfully" });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.PlanController = PlanController;
//# sourceMappingURL=plan.controller.js.map