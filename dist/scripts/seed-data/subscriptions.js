"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedSubscriptions = seedSubscriptions;
const prisma_1 = require("../../generated/prisma");
async function seedSubscriptions({ prisma, now, addDays, users, }) {
    const [standardPlan, professionalPlan] = await Promise.all([
        prisma.subscriptionPlan.create({
            data: {
                code: prisma_1.SubscriptionPlanCode.STANDARD,
                name: "Standard",
                description: "Standard plan unlocking CV generator and 2 assessments per month.",
                priceIdr: 25000,
                perks: [
                    "ATS CV Generator",
                    "2 skill assessments per month",
                    "Basic email reminders",
                ],
                monthlyAssessmentQuota: 2,
            },
        }),
        prisma.subscriptionPlan.create({
            data: {
                code: prisma_1.SubscriptionPlanCode.PROFESSIONAL,
                name: "Professional Plan",
                description: "Advanced features for serious job seekers",
                priceIdr: 100000,
                perks: [
                    "ATS CV Generator",
                    "Unlimited skill assessments",
                    "Priority review when applying for jobs",
                    "Advanced CV templates",
                    "Priority customer support",
                    "Detailed analytics and insights",
                    "Premium badge showcase",
                    "Enhanced profile visibility"
                ],
                monthlyAssessmentQuota: null,
            },
        }),
    ]);
    const { seekers, developer } = users;
    const thirtyDaysLater = addDays(30);
    const fifteenDaysLater = addDays(15);
    const sixtyDaysAgo = addDays(-60);
    const fortyDaysAgo = addDays(-40);
    const thirtyDaysAgo = addDays(-30);
    const twelveDaysAgo = addDays(-12);
    const elevenDaysAgo = addDays(-11);
    const tenDaysAgo = addDays(-10);
    await prisma.subscription.create({
        data: {
            userId: seekers.alice.id,
            planId: professionalPlan.id,
            status: prisma_1.SubscriptionStatus.ACTIVE,
            startDate: now,
            paidAt: now,
            expiresAt: thirtyDaysLater,
            approvedByDeveloperId: developer.id,
            lastReminderSentAt: addDays(29),
            payments: {
                create: {
                    amount: new prisma_1.Prisma.Decimal(100000),
                    paymentMethod: prisma_1.PaymentMethod.TRANSFER,
                    status: prisma_1.PaymentStatus.APPROVED,
                    paymentProof: "https://res.cloudinary.com/demo/payments/alice-transfer.jpg",
                    paidAt: now,
                    approvedAt: now,
                    approvedById: developer.id,
                    referenceCode: "PRO-INV-ALICE-001",
                },
            },
        },
    });
    await prisma.subscription.create({
        data: {
            userId: seekers.bob.id,
            planId: standardPlan.id,
            status: prisma_1.SubscriptionStatus.PENDING,
            paymentMethod: prisma_1.PaymentMethod.TRANSFER,
            proofUrl: "https://res.cloudinary.com/demo/payments/bob-proof.jpg",
            payments: {
                create: {
                    amount: new prisma_1.Prisma.Decimal(25000),
                    paymentMethod: prisma_1.PaymentMethod.TRANSFER,
                    status: prisma_1.PaymentStatus.PENDING,
                    paymentProof: "https://res.cloudinary.com/demo/payments/bob-proof.jpg",
                    expiresAt: addDays(1),
                    referenceCode: "STD-INV-BOB-001",
                },
            },
        },
    });
    await prisma.subscription.create({
        data: {
            userId: seekers.diana.id,
            planId: professionalPlan.id,
            status: prisma_1.SubscriptionStatus.EXPIRED,
            startDate: sixtyDaysAgo,
            paidAt: sixtyDaysAgo,
            expiresAt: thirtyDaysAgo,
            lastReminderSentAt: thirtyDaysAgo,
            payments: {
                create: {
                    amount: new prisma_1.Prisma.Decimal(100000),
                    paymentMethod: prisma_1.PaymentMethod.TRANSFER,
                    status: prisma_1.PaymentStatus.APPROVED,
                    paidAt: sixtyDaysAgo,
                    approvedAt: sixtyDaysAgo,
                    approvedById: developer.id,
                    referenceCode: "PRO-INV-DIANA-001",
                },
            },
        },
    });
    const ginaProfessional = await prisma.subscription.create({
        data: {
            userId: seekers.gina.id,
            planId: professionalPlan.id,
            status: prisma_1.SubscriptionStatus.ACTIVE,
            startDate: now,
            paidAt: now,
            expiresAt: fifteenDaysLater,
            paymentMethod: prisma_1.PaymentMethod.GATEWAY,
            payments: {
                create: {
                    amount: new prisma_1.Prisma.Decimal(100000),
                    paymentMethod: prisma_1.PaymentMethod.GATEWAY,
                    status: prisma_1.PaymentStatus.APPROVED,
                    paidAt: now,
                    gatewayTransactionId: "GATEWAY-8821",
                    referenceCode: "PRO-INV-GINA-002",
                },
            },
        },
    });
    await prisma.subscription.create({
        data: {
            userId: seekers.eko.id,
            planId: standardPlan.id,
            status: prisma_1.SubscriptionStatus.CANCELLED,
            startDate: fortyDaysAgo,
            paidAt: fortyDaysAgo,
            expiresAt: twelveDaysAgo,
            cancelledAt: tenDaysAgo,
            lastReminderSentAt: elevenDaysAgo,
            payments: {
                create: {
                    amount: new prisma_1.Prisma.Decimal(25000),
                    paymentMethod: prisma_1.PaymentMethod.TRANSFER,
                    status: prisma_1.PaymentStatus.APPROVED,
                    paidAt: fortyDaysAgo,
                    approvedAt: fortyDaysAgo,
                    approvedById: developer.id,
                    referenceCode: "STD-INV-EKO-001",
                },
            },
        },
    });
    // Testing Users Subscriptions
    const testProfessionalSubscription = await prisma.subscription.create({
        data: {
            userId: seekers.testProfessional.id,
            planId: professionalPlan.id,
            status: prisma_1.SubscriptionStatus.ACTIVE,
            startDate: now,
            paidAt: now,
            expiresAt: thirtyDaysLater,
            approvedByDeveloperId: developer.id,
            payments: {
                create: {
                    amount: new prisma_1.Prisma.Decimal(100000),
                    paymentMethod: prisma_1.PaymentMethod.TRANSFER,
                    status: prisma_1.PaymentStatus.APPROVED,
                    paymentProof: "https://res.cloudinary.com/demo/payments/test-professional.jpg",
                    paidAt: now,
                    approvedAt: now,
                    approvedById: developer.id,
                    referenceCode: "PRO-INV-TEST-001",
                },
            },
        },
    });
    const testStandardSubscription = await prisma.subscription.create({
        data: {
            userId: seekers.testStandard.id,
            planId: standardPlan.id,
            status: prisma_1.SubscriptionStatus.ACTIVE,
            startDate: now,
            paidAt: now,
            expiresAt: thirtyDaysLater,
            approvedByDeveloperId: developer.id,
            payments: {
                create: {
                    amount: new prisma_1.Prisma.Decimal(25000),
                    paymentMethod: prisma_1.PaymentMethod.TRANSFER,
                    status: prisma_1.PaymentStatus.APPROVED,
                    paymentProof: "https://res.cloudinary.com/demo/payments/test-standard.jpg",
                    paidAt: now,
                    approvedAt: now,
                    approvedById: developer.id,
                    referenceCode: "STD-INV-TEST-001",
                },
            },
        },
    });
    return {
        standardPlan,
        professionalPlan,
        ginaProfessional,
        testProfessionalSubscription,
        testStandardSubscription
    };
}
//# sourceMappingURL=subscriptions.js.map