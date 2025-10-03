"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentService = void 0;
const payment_repository_1 = require("../../repositories/subscription/payment.repository");
const paymentValidation_service_1 = require("./paymentValidation.service");
const subscriptionActivation_service_1 = require("./subscriptionActivation.service");
class PaymentService {
    static async getPendingPayments() {
        return await payment_repository_1.PaymentRepo.getPendingPayments();
    }
    static async getPaymentById(id) {
        return await paymentValidation_service_1.PaymentValidationService.validatePaymentExists(id);
    }
    static async uploadPaymentProof(paymentId, paymentProof) {
        const payment = await paymentValidation_service_1.PaymentValidationService.validatePaymentExists(paymentId);
        paymentValidation_service_1.PaymentValidationService.validatePaymentStatus(payment);
        return await payment_repository_1.PaymentRepo.uploadPaymentProof(paymentId, paymentProof);
    }
    static async approvePayment(paymentId) {
        const payment = await paymentValidation_service_1.PaymentValidationService.validatePaymentExists(paymentId);
        paymentValidation_service_1.PaymentValidationService.validatePaymentStatus(payment);
        const updatedPayment = await payment_repository_1.PaymentRepo.updatePaymentStatus(paymentId, "APPROVED", new Date());
        await subscriptionActivation_service_1.SubscriptionActivationService.activateSubscription(payment.subscriptionId);
        return updatedPayment;
    }
    static async rejectPayment(paymentId) {
        const payment = await paymentValidation_service_1.PaymentValidationService.validatePaymentExists(paymentId);
        paymentValidation_service_1.PaymentValidationService.validatePaymentStatus(payment);
        return await payment_repository_1.PaymentRepo.updatePaymentStatus(paymentId, "REJECTED");
    }
    static async getPaymentsBySubscriptionId(subscriptionId) {
        return await payment_repository_1.PaymentRepo.getPaymentsBySubscriptionId(subscriptionId);
    }
}
exports.PaymentService = PaymentService;
//# sourceMappingURL=payment.service.js.map