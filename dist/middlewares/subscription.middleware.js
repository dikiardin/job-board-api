"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkTemplateAccess = exports.checkCVGenerationLimit = exports.checkSubscription = void 0;
const prisma_1 = require("../config/prisma");
// Define subscription limits
const SUBSCRIPTION_LIMITS = {
    Standard: {
        cvGenerationLimit: 5, // 5 CV per month
        templatesAccess: ["ats"], // ATS template only
        additionalFeatures: ["basic_download"],
    },
    Professional: {
        cvGenerationLimit: -1, // Unlimited
        templatesAccess: ["ats"], // ATS template only (same as Standard now)
        additionalFeatures: ["basic_download", "premium_templates", "analytics"],
    },
};
const checkSubscription = async (req, res, next) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        // Get user's active subscription
        const activeSubscription = await prisma_1.prisma.subscription.findFirst({
            where: {
                userId,
                isActive: true,
                endDate: {
                    gte: new Date(), // Subscription belum expired
                },
            },
            include: {
                plan: true,
            },
        });
        if (!activeSubscription) {
            return res.status(403).json({
                message: "Active subscription required to use CV Generator",
                code: "SUBSCRIPTION_REQUIRED",
            });
        }
        // Check if subscription is expired
        if (activeSubscription.endDate < new Date()) {
            return res.status(403).json({
                message: "Your subscription has expired. Please renew to continue using CV Generator",
                code: "SUBSCRIPTION_EXPIRED",
            });
        }
        // Attach subscription info to request
        req.subscription = {
            plan: activeSubscription.plan,
            limits: SUBSCRIPTION_LIMITS[activeSubscription.plan.planName] ||
                SUBSCRIPTION_LIMITS["Standard"],
            endDate: activeSubscription.endDate,
        };
        next();
    }
    catch (error) {
        console.error("Subscription check error:", error);
        res.status(500).json({
            message: "Failed to verify subscription",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
};
exports.checkSubscription = checkSubscription;
const checkCVGenerationLimit = async (req, res, next) => {
    try {
        const userId = req.user?.id;
        const limits = req.subscription?.limits;
        if (!userId || !limits) {
            return res
                .status(403)
                .json({ message: "Subscription verification failed" });
        }
        // Skip limit check for unlimited plans
        if (limits.cvGenerationLimit === -1) {
            return next();
        }
        // Count CVs generated this month
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);
        const cvCount = await prisma_1.prisma.generatedCV.count({
            where: {
                userId,
                createdAt: {
                    gte: startOfMonth,
                },
            },
        });
        if (cvCount >= limits.cvGenerationLimit) {
            return res.status(403).json({
                message: `CV generation limit reached. You can generate ${limits.cvGenerationLimit} CVs per month with your current plan.`,
                code: "GENERATION_LIMIT_EXCEEDED",
                currentCount: cvCount,
                limit: limits.cvGenerationLimit,
            });
        }
        next();
    }
    catch (error) {
        console.error("CV generation limit check error:", error);
        res.status(500).json({
            message: "Failed to check generation limit",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
};
exports.checkCVGenerationLimit = checkCVGenerationLimit;
const checkTemplateAccess = (req, res, next) => {
    const { templateType = "ats" } = req.body;
    const limits = req.subscription?.limits;
    if (!limits) {
        return res
            .status(403)
            .json({ message: "Subscription verification failed" });
    }
    if (!limits.templatesAccess.includes(templateType)) {
        return res.status(403).json({
            message: `Template '${templateType}' is not available with your current subscription plan.`,
            code: "TEMPLATE_ACCESS_DENIED",
            availableTemplates: limits.templatesAccess,
            requestedTemplate: templateType,
        });
    }
    next();
};
exports.checkTemplateAccess = checkTemplateAccess;
//# sourceMappingURL=subscription.middleware.js.map