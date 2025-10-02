"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentService = void 0;
const payment_repository_1 = require("../../repositories/subscription/payment.repository");
const subscription_repository_1 = require("../../repositories/subscription/subscription.repository");
const customError_1 = require("../../utils/customError");
class PaymentService {
    static async getPendingPayments() {
        return await payment_repository_1.PaymentRepo.getPendingPayments();
    }
    static async getPaymentById(id) {
        const payment = await payment_repository_1.PaymentRepo.getPaymentById(id);
        if (!payment) {
            throw new customError_1.CustomError("Payment not found", 404);
        }
        return payment;
    }
    static async uploadPaymentProof(paymentId, paymentProof) {
        const payment = await payment_repository_1.PaymentRepo.getPaymentById(paymentId);
        if (!payment) {
            throw new customError_1.CustomError("Payment not found", 404);
        }
        if (payment.status !== "PENDING") {
            throw new customError_1.CustomError("Payment is not in pending status", 400);
        }
        return await payment_repository_1.PaymentRepo.uploadPaymentProof(paymentId, paymentProof);
    }
    static async approvePayment(paymentId) {
        const payment = await payment_repository_1.PaymentRepo.getPaymentById(paymentId);
        if (!payment) {
            throw new customError_1.CustomError("Payment not found", 404);
        }
        if (payment.status !== "PENDING") {
            throw new customError_1.CustomError("Payment is not in pending status", 400);
        }
        // Update payment status to approved
        const updatedPayment = await payment_repository_1.PaymentRepo.updatePaymentStatus(paymentId, "APPROVED", new Date());
        // Set subscription dates based on payment approval date
        const paymentDate = new Date();
        const endDate = new Date(paymentDate);
        endDate.setHours(endDate.getHours() + 24); // 24 hours from payment approval date (for testing)
        // Activate subscription with correct dates
        await subscription_repository_1.SubscriptionRepo.updateSubscription(payment.subscriptionId, {
            isActive: true,
            startDate: paymentDate,
            endDate: endDate,
        });
        return updatedPayment;
    }
    static async rejectPayment(paymentId) {
        const payment = await payment_repository_1.PaymentRepo.getPaymentById(paymentId);
        if (!payment) {
            throw new customError_1.CustomError("Payment not found", 404);
        }
        if (payment.status !== "PENDING") {
            throw new customError_1.CustomError("Payment is not in pending status", 400);
        }
        return await payment_repository_1.PaymentRepo.updatePaymentStatus(paymentId, "REJECTED");
    }
    static async getPaymentsBySubscriptionId(subscriptionId) {
        return await payment_repository_1.PaymentRepo.getPaymentsBySubscriptionId(subscriptionId);
    }
}
exports.PaymentService = PaymentService;
//# sourceMappingURL=payment.service.js.map