"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentActionController = void 0;
const payment_service_1 = require("../../services/subscription/payment.service");
const controllerHelper_1 = require("../../utils/controllerHelper");
class PaymentActionController {
    static async approvePayment(req, res, next) {
        try {
            const id = controllerHelper_1.ControllerHelper.parseId(req.params.id);
            const payment = await payment_service_1.PaymentService.approvePayment(id);
            res.status(200).json(payment);
        }
        catch (error) {
            next(error);
        }
    }
    static async approvePaymentBySlug(req, res, next) {
        try {
            const { slug } = req.params;
            controllerHelper_1.ControllerHelper.validateRequired({ slug }, "Payment slug is required");
            const payment = await payment_service_1.PaymentService.approvePaymentBySlug(slug);
            res.status(200).json(payment);
        }
        catch (error) {
            next(error);
        }
    }
    static async rejectPayment(req, res, next) {
        try {
            const id = controllerHelper_1.ControllerHelper.parseId(req.params.id);
            const payment = await payment_service_1.PaymentService.rejectPayment(id);
            res.status(200).json(payment);
        }
        catch (error) {
            next(error);
        }
    }
    static async rejectPaymentBySlug(req, res, next) {
        try {
            const { slug } = req.params;
            controllerHelper_1.ControllerHelper.validateRequired({ slug }, "Payment slug is required");
            const payment = await payment_service_1.PaymentService.rejectPaymentBySlug(slug);
            res.status(200).json(payment);
        }
        catch (error) {
            next(error);
        }
    }
}
exports.PaymentActionController = PaymentActionController;
