"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentController = void 0;
const payment_service_1 = require("../../services/subscription/payment.service");
const cloudinary_1 = require("../../config/cloudinary");
const controllerHelper_1 = require("../../utils/controllerHelper");
class PaymentController {
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
    static async uploadPaymentProof(req, res, next) {
        try {
            const paymentId = controllerHelper_1.ControllerHelper.parseId(req.params.paymentId);
            controllerHelper_1.ControllerHelper.validateRequired({ file: req.file }, "Payment proof image is required");
            const cloudinaryResult = await (0, cloudinary_1.cloudinaryUpload)(req.file);
            const payment = await payment_service_1.PaymentService.uploadPaymentProof(paymentId, cloudinaryResult.secure_url);
            res.status(200).json({
                ...payment,
                cloudinary: {
                    public_id: cloudinaryResult.public_id,
                    secure_url: cloudinaryResult.secure_url,
                    width: cloudinaryResult.width,
                    height: cloudinaryResult.height,
                    format: cloudinaryResult.format,
                },
            });
        }
        catch (error) {
            next(error);
        }
    }
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
exports.PaymentController = PaymentController;
//# sourceMappingURL=payment.controller.js.map