"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentMutationRepo = void 0;
const prisma_1 = require("../../config/prisma");
class PaymentMutationRepo {
    // Create payment
    static async createPayment(data) {
        try {
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
            return result;
        }
        catch (error) {
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
    // Upload payment proof by slug
    static async uploadPaymentProofBySlug(slug, paymentProof) {
        return prisma_1.prisma.payment.update({
            where: { slug },
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
    // Update payment status by slug
    static async updatePaymentStatusBySlug(slug, status, approvedAt) {
        return prisma_1.prisma.payment.update({
            where: { slug },
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
}
exports.PaymentMutationRepo = PaymentMutationRepo;
