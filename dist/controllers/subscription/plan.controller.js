"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlanController = void 0;
const plan_service_1 = require("../../services/subscription/plan.service");
const controllerHelper_1 = require("../../utils/controllerHelper");
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
            const id = controllerHelper_1.ControllerHelper.parseId(req.params.id);
            const plan = await plan_service_1.PlanService.getPlanById(id);
            res.status(200).json(plan);
        }
        catch (error) {
            next(error);
        }
    }
    static async createPlan(req, res, next) {
        try {
            const { planName, planPrice, planDescription } = req.body;
            controllerHelper_1.ControllerHelper.validateRequired({ planName, planPrice, planDescription }, "Plan name, price, and description are required");
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
            const id = controllerHelper_1.ControllerHelper.parseId(req.params.id);
            const updateData = controllerHelper_1.ControllerHelper.buildUpdateData(req.body, [
                'planName', 'planPrice', 'planDescription'
            ]);
            if (updateData.planPrice) {
                updateData.planPrice = parseFloat(updateData.planPrice);
            }
            const plan = await plan_service_1.PlanService.updatePlan(id, updateData);
            res.status(200).json(plan);
        }
        catch (error) {
            next(error);
        }
    }
    static async deletePlan(req, res, next) {
        try {
            const id = controllerHelper_1.ControllerHelper.parseId(req.params.id);
            await plan_service_1.PlanService.deletePlan(id);
            res.status(200).json({ message: "Subscription plan deleted successfully" });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.PlanController = PlanController;
//# sourceMappingURL=plan.controller.js.map