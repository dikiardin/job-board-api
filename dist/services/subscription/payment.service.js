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
    static async getPaymentBySlug(slug) {
        const payment = await payment_repository_1.PaymentRepo.getPaymentBySlug(slug);
        if (!payment) {
            throw new Error("Payment not found");
        }
        return payment;
    }
    // Fallback method that tries slug first, then ID for backward compatibility
    static async getPaymentBySlugOrId(slugOrId) {
        // Try slug first
        const payment = await payment_repository_1.PaymentRepo.getPaymentBySlug(slugOrId);
        if (payment) {
            return payment;
        }
        // If not found and looks like a number, try ID
        const numericId = parseInt(slugOrId, 10);
        if (!isNaN(numericId)) {
            return await paymentValidation_service_1.PaymentValidationService.validatePaymentExists(numericId);
        }
        throw new Error("Payment not found");
    }
    static async uploadPaymentProof(paymentId, paymentProof) {
        const payment = await paymentValidation_service_1.PaymentValidationService.validatePaymentExists(paymentId);
        paymentValidation_service_1.PaymentValidationService.validatePaymentStatus(payment);
        return await payment_repository_1.PaymentRepo.uploadPaymentProof(paymentId, paymentProof);
    }
    static async uploadPaymentProofBySlug(slug, paymentProof) {
        const payment = await this.getPaymentBySlug(slug);
        paymentValidation_service_1.PaymentValidationService.validatePaymentStatus(payment);
        return await payment_repository_1.PaymentRepo.uploadPaymentProofBySlug(slug, paymentProof);
    }
    static async approvePayment(paymentId) {
        const payment = await paymentValidation_service_1.PaymentValidationService.validatePaymentExists(paymentId);
        paymentValidation_service_1.PaymentValidationService.validatePaymentStatus(payment);
        const updatedPayment = await payment_repository_1.PaymentRepo.updatePaymentStatus(paymentId, "APPROVED", new Date());
        await subscriptionActivation_service_1.SubscriptionActivationService.activateSubscription(payment.subscriptionId);
        return updatedPayment;
    }
    static async approvePaymentBySlug(slug) {
        const payment = await this.getPaymentBySlug(slug);
        paymentValidation_service_1.PaymentValidationService.validatePaymentStatus(payment);
        const updatedPayment = await payment_repository_1.PaymentRepo.updatePaymentStatusBySlug(slug, "APPROVED", new Date());
        await subscriptionActivation_service_1.SubscriptionActivationService.activateSubscription(payment.subscriptionId);
        return updatedPayment;
    }
    static async rejectPayment(paymentId) {
        const payment = await paymentValidation_service_1.PaymentValidationService.validatePaymentExists(paymentId);
        paymentValidation_service_1.PaymentValidationService.validatePaymentStatus(payment);
        return await payment_repository_1.PaymentRepo.updatePaymentStatus(paymentId, "REJECTED");
    }
    static async rejectPaymentBySlug(slug) {
        const payment = await this.getPaymentBySlug(slug);
        paymentValidation_service_1.PaymentValidationService.validatePaymentStatus(payment);
        return await payment_repository_1.PaymentRepo.updatePaymentStatusBySlug(slug, "REJECTED");
    }
    static async getPaymentsBySubscriptionId(subscriptionId) {
        return await payment_repository_1.PaymentRepo.getPaymentsBySubscriptionId(subscriptionId);
    }
}
exports.PaymentService = PaymentService;
