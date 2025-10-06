"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentManagementService = void 0;
const payment_repository_1 = require("../../repositories/subscription/payment.repository");
const dateHelper_1 = require("../../utils/dateHelper");
class PaymentManagementService {
    static async createPaymentRecord(subscriptionId, planPrice) {
        try {
            const expiredAt = dateHelper_1.DateHelper.getPaymentExpiration();
            console.log("Creating payment record with data:", {
                subscriptionId,
                paymentMethod: "TRANSFER",
                amount: Number(planPrice),
                expiresAt: expiredAt,
            });
            const result = await payment_repository_1.PaymentRepo.createPayment({
                subscriptionId,
                paymentMethod: "TRANSFER",
                amount: Number(planPrice),
                expiresAt: expiredAt,
            });
            console.log("Payment creation result:", result);
            return result;
        }
        catch (error) {
            console.error("Error in createPaymentRecord:", error);
            throw error;
        }
    }
    static async getPendingPayments() {
        return await payment_repository_1.PaymentRepo.getPendingPayments();
    }
    static async getPaymentById(id) {
        return await payment_repository_1.PaymentRepo.getPaymentById(id);
    }
    static async uploadPaymentProof(paymentId, proofUrl) {
        return await payment_repository_1.PaymentRepo.uploadPaymentProof(paymentId, proofUrl);
    }
    static async approvePayment(id) {
        return await payment_repository_1.PaymentRepo.approvePayment(id);
    }
    static async rejectPayment(id) {
        return await payment_repository_1.PaymentRepo.rejectPayment(id);
    }
    static async getPaymentsBySubscriptionId(subscriptionId) {
        return await payment_repository_1.PaymentRepo.getPaymentsBySubscriptionId(subscriptionId);
    }
}
exports.PaymentManagementService = PaymentManagementService;
//# sourceMappingURL=paymentManagement.service.js.map