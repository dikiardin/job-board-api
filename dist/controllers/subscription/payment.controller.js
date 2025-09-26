"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentController = void 0;
const payment_service_1 = require("../../services/subscription/payment.service");
const cloudinary_1 = require("../../config/cloudinary");
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
            const { id } = req.params;
            const payment = await payment_service_1.PaymentService.getPaymentById(parseInt(id));
            res.status(200).json(payment);
        }
        catch (error) {
            next(error);
        }
    }
    static async uploadPaymentProof(req, res, next) {
        try {
            const { paymentId } = req.params;
            // Check if file was uploaded
            if (!req.file) {
                return res
                    .status(400)
                    .json({ message: "Payment proof image is required" });
            }
            // Upload to Cloudinary
            const cloudinaryResult = await (0, cloudinary_1.cloudinaryUpload)(req.file);
            const payment = await payment_service_1.PaymentService.uploadPaymentProof(parseInt(paymentId), cloudinaryResult.secure_url);
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
            console.error("Upload payment proof error:", error);
            next(error);
        }
    }
    static async approvePayment(req, res, next) {
        try {
            const { id } = req.params;
            const payment = await payment_service_1.PaymentService.approvePayment(parseInt(id));
            res.status(200).json(payment);
        }
        catch (error) {
            next(error);
        }
    }
    static async rejectPayment(req, res, next) {
        try {
            const { id } = req.params;
            const payment = await payment_service_1.PaymentService.rejectPayment(parseInt(id));
            res.status(200).json(payment);
        }
        catch (error) {
            next(error);
        }
    }
    static async getPaymentsBySubscriptionId(req, res, next) {
        try {
            const { subscriptionId } = req.params;
            const payments = await payment_service_1.PaymentService.getPaymentsBySubscriptionId(parseInt(subscriptionId));
            res.status(200).json(payments);
        }
        catch (error) {
            next(error);
        }
    }
}
exports.PaymentController = PaymentController;
//# sourceMappingURL=payment.controller.js.map