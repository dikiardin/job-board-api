"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentRepo = void 0;
const paymentQuery_repository_1 = require("./paymentQuery.repository");
const paymentMutation_repository_1 = require("./paymentMutation.repository");
const paymentAction_repository_1 = require("./paymentAction.repository");
class PaymentRepo {
    // Get all pending payments
    static async getPendingPayments() {
        return paymentQuery_repository_1.PaymentQueryRepo.getPendingPayments();
    }
    // Get payment by ID
    static async getPaymentById(id) {
        return paymentQuery_repository_1.PaymentQueryRepo.getPaymentById(id);
    }
    // Get payment by slug
    static async getPaymentBySlug(slug) {
        return paymentQuery_repository_1.PaymentQueryRepo.getPaymentBySlug(slug);
    }
    // Create payment
    static async createPayment(data) {
        return paymentMutation_repository_1.PaymentMutationRepo.createPayment(data);
    }
    // Upload payment proof
    static async uploadPaymentProof(paymentId, paymentProof) {
        return paymentMutation_repository_1.PaymentMutationRepo.uploadPaymentProof(paymentId, paymentProof);
    }
    // Upload payment proof by slug
    static async uploadPaymentProofBySlug(slug, paymentProof) {
        return paymentMutation_repository_1.PaymentMutationRepo.uploadPaymentProofBySlug(slug, paymentProof);
    }
    // Update payment status
    static async updatePaymentStatus(paymentId, status, approvedAt) {
        return paymentMutation_repository_1.PaymentMutationRepo.updatePaymentStatus(paymentId, status, approvedAt);
    }
    // Update payment status by slug
    static async updatePaymentStatusBySlug(slug, status, approvedAt) {
        return paymentMutation_repository_1.PaymentMutationRepo.updatePaymentStatusBySlug(slug, status, approvedAt);
    }
    // Get payments by subscription ID
    static async getPaymentsBySubscriptionId(subscriptionId) {
        return paymentQuery_repository_1.PaymentQueryRepo.getPaymentsBySubscriptionId(subscriptionId);
    }
    // Approve payment
    static async approvePayment(id) {
        return paymentAction_repository_1.PaymentActionRepo.approvePayment(id);
    }
    // Reject payment
    static async rejectPayment(id) {
        return paymentAction_repository_1.PaymentActionRepo.rejectPayment(id);
    }
    // Approve payment by slug
    static async approvePaymentBySlug(slug) {
        return paymentAction_repository_1.PaymentActionRepo.approvePaymentBySlug(slug);
    }
    // Reject payment by slug
    static async rejectPaymentBySlug(slug) {
        return paymentAction_repository_1.PaymentActionRepo.rejectPaymentBySlug(slug);
    }
}
exports.PaymentRepo = PaymentRepo;
//# sourceMappingURL=payment.repository.js.map