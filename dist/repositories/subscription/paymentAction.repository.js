"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentActionRepo = void 0;
const paymentMutation_repository_1 = require("./paymentMutation.repository");
class PaymentActionRepo {
    // Approve payment
    static async approvePayment(id) {
        return paymentMutation_repository_1.PaymentMutationRepo.updatePaymentStatus(id, "APPROVED", new Date());
    }
    // Reject payment
    static async rejectPayment(id) {
        return paymentMutation_repository_1.PaymentMutationRepo.updatePaymentStatus(id, "REJECTED");
    }
    // Approve payment by slug
    static async approvePaymentBySlug(slug) {
        return paymentMutation_repository_1.PaymentMutationRepo.updatePaymentStatusBySlug(slug, "APPROVED", new Date());
    }
    // Reject payment by slug
    static async rejectPaymentBySlug(slug) {
        return paymentMutation_repository_1.PaymentMutationRepo.updatePaymentStatusBySlug(slug, "REJECTED");
    }
}
exports.PaymentActionRepo = PaymentActionRepo;
