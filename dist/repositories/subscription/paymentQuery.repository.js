"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentQueryRepo = void 0;
const prisma_1 = require("../../config/prisma");
class PaymentQueryRepo {
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
    // Get payment by slug
    static async getPaymentBySlug(slug) {
        return prisma_1.prisma.payment.findUnique({
            where: { slug },
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
}
exports.PaymentQueryRepo = PaymentQueryRepo;
//# sourceMappingURL=paymentQuery.repository.js.map