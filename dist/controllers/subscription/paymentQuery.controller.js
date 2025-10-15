"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentQueryController = void 0;
const payment_service_1 = require("../../services/subscription/payment.service");
const controllerHelper_1 = require("../../utils/controllerHelper");
class PaymentQueryController {
    static async getPendingPayments(req, res, next) {
        try {
            const payments = await payment_service_1.PaymentService.getPendingPayments();
            res.status(200).json(payments);
        }
        catch (error) {
            next(error);
        }
    }
    static async getPaymentById(req, res, next) {
        try {
            const id = controllerHelper_1.ControllerHelper.parseId(req.params.id);
            const payment = await payment_service_1.PaymentService.getPaymentById(id);
            res.status(200).json(payment);
        }
        catch (error) {
            next(error);
        }
    }
    static async getPaymentBySlug(req, res, next) {
        try {
            const { slug } = req.params;
            controllerHelper_1.ControllerHelper.validateRequired({ slug }, "Payment slug is required");
            const payment = await payment_service_1.PaymentService.getPaymentBySlugOrId(slug);
            res.status(200).json(payment);
        }
        catch (error) {
            next(error);
        }
    }
    static async getPaymentsBySubscriptionId(req, res, next) {
        try {
            const subscriptionId = controllerHelper_1.ControllerHelper.parseId(req.params.subscriptionId);
            const payments = await payment_service_1.PaymentService.getPaymentsBySubscriptionId(subscriptionId);
            res.status(200).json(payments);
        }
        catch (error) {
            next(error);
        }
    }
}
exports.PaymentQueryController = PaymentQueryController;
//# sourceMappingURL=paymentQuery.controller.js.map