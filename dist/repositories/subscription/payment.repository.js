"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentRepo = void 0;
const prisma_1 = require("../../config/prisma");
class PaymentRepo {
    // Get all pending payments
    static async getPendingPayments() {
        return prisma_1.prisma.payment.findMany({
            where: { status: "PENDING" },
            include: {
                subscription: {
                    include: {
                        user: {
                            select: { id: true, name: true, email: true },
                        },
                        plan: true,
                    },
                },
            },
            orderBy: { createdAt: "desc" },
        });
    }
    // Get payment by ID
    static async getPaymentById(id) {
        return prisma_1.prisma.payment.findUnique({
            where: { id },
            include: {
                subscription: {
                    include: {
                        user: {
                            select: { id: true, name: true, email: true },
                        },
                        plan: true,
                    },
                },
            },
        });
    }
    // Create payment
    static async createPayment(data) {
        try {
            console.log("PaymentRepo.createPayment called with data:", data);
            const result = await prisma_1.prisma.payment.create({
                data,
                include: {
                    subscription: {
                        include: {
                            plan: true,
                        },
                    },
                },
            });
            console.log("PaymentRepo.createPayment result:", result);
            return result;
        }
        catch (error) {
            console.error("Error in PaymentRepo.createPayment:", error);
            throw error;
        }
    }
    // Upload payment proof
    static async uploadPaymentProof(paymentId, paymentProof) {
        return prisma_1.prisma.payment.update({
            where: { id: paymentId },
            data: { paymentProof },
        });
    }
    // Update payment status
    static async updatePaymentStatus(paymentId, status, approvedAt) {
        return prisma_1.prisma.payment.update({
            where: { id: paymentId },
            data: {
                status,
                ...(approvedAt && { approvedAt }),
            },
            include: {
                subscription: {
                    include: {
                        user: {
                            select: { id: true, name: true, email: true },
                        },
                        plan: true,
                    },
                },
            },
        });
    }
    // Get payments by subscription ID
    static async getPaymentsBySubscriptionId(subscriptionId) {
        return prisma_1.prisma.payment.findMany({
            where: { subscriptionId },
            orderBy: { createdAt: "desc" },
        });
    }
    // Approve payment
    static async approvePayment(id) {
        return this.updatePaymentStatus(id, "APPROVED", new Date());
    }
    // Reject payment
    static async rejectPayment(id) {
        return this.updatePaymentStatus(id, "REJECTED");
    }
}
exports.PaymentRepo = PaymentRepo;
//# sourceMappingURL=payment.repository.js.map