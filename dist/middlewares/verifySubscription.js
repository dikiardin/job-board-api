"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkAssessmentLimits = exports.verifySubscription = void 0;
const prisma_1 = require("../config/prisma");
const prisma_2 = require("../generated/prisma");
const ASSESSMENT_LIMITS = {
    STANDARD: 2,
    PROFESSIONAL: -1,
};
const verifySubscription = async (req, res, next) => {
    try {
        const { userId } = res.locals.decrypt;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Authentication required" });
        }
        // Check for ACTIVE subscription first
        let subscription = await prisma_1.prisma.subscription.findFirst({
            where: {
                userId,
                status: prisma_2.SubscriptionStatus.ACTIVE,
                expiresAt: { gt: new Date() },
            },
            include: { plan: true, usage: true },
        });
        // If no active subscription, check for recent PENDING subscription (within 24 hours)
        if (!subscription) {
            const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
            subscription = await prisma_1.prisma.subscription.findFirst({
                where: {
                    userId,
                    status: prisma_2.SubscriptionStatus.PENDING,
                    createdAt: { gte: twentyFourHoursAgo },
                },
                include: { plan: true, usage: true },
            });
        }
        if (!subscription) {
            return res.status(403).json({
                success: false,
                message: "Active subscription required to access skill assessments",
                code: "SUBSCRIPTION_REQUIRED",
            });
        }
        const planCode = subscription.plan.code;
        res.locals.subscription = {
            id: subscription.id,
            planCode,
            planName: subscription.plan.name,
            priceIdr: subscription.plan.priceIdr,
            expiresAt: subscription.expiresAt,
            status: subscription.status,
        };
        next();
    }
    catch (error) {
        console.error("Subscription verification error:", error);
        res.status(500).json({
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
};
exports.verifySubscription = verifySubscription;
const checkAssessmentLimits = async (req, res, next) => {
    try {
        const { userId } = res.locals.decrypt;
        const { subscription } = res.locals;
        if (!userId || !subscription) {
            return res.status(403).json({ success: false, message: "Subscription verification required" });
        }
        const planKey = subscription.planCode.toUpperCase();
        const monthlyLimit = ASSESSMENT_LIMITS[planKey] ?? 2;
        if (monthlyLimit === -1) {
            return next();
        }
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);
        const attemptCount = await prisma_1.prisma.skillResult.count({
            where: {
                userId,
                createdAt: { gte: startOfMonth },
            },
        });
        if (attemptCount >= monthlyLimit) {
            const resetDate = new Date(startOfMonth);
            resetDate.setMonth(resetDate.getMonth() + 1);
            const isStandard = planKey === "STANDARD";
            return res.status(403).json({
                success: false,
                message: `Assessment limit reached. You can take ${monthlyLimit} skill assessments per month with your ${subscription.planName} plan`,
                code: "ASSESSMENT_LIMIT_EXCEEDED",
                currentCount: attemptCount,
                limit: monthlyLimit,
                resetDate,
                upgradeMessage: isStandard
                    ? "Upgrade to Professional plan (IDR 100,000/month) for unlimited assessments and priority review."
                    : null,
            });
        }
        res.locals.assessmentInfo = {
            used: attemptCount,
            limit: monthlyLimit,
            remaining: monthlyLimit - attemptCount,
        };
        next();
    }
    catch (error) {
        console.error("Assessment limit check error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to check assessment limits",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
};
exports.checkAssessmentLimits = checkAssessmentLimits;
//# sourceMappingURL=verifySubscription.js.map