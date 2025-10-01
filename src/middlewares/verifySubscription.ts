import { Request, Response, NextFunction } from "express";
import { prisma } from "../config/prisma";

export const verifySubscription = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = res.locals.decrypt;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    // Get user's active subscription
    const activeSubscription = await prisma.subscription.findFirst({
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
        success: false,
        message: "Active subscription required to access skill assessments",
        code: "SUBSCRIPTION_REQUIRED",
        details: "Please purchase a subscription to take skill assessments and earn certificates",
      });
    }

    // Check if subscription is expired
    if (activeSubscription.endDate < new Date()) {
      return res.status(403).json({
        success: false,
        message: "Your subscription has expired. Please renew to continue accessing skill assessments",
        code: "SUBSCRIPTION_EXPIRED",
        expiredDate: activeSubscription.endDate,
      });
    }

    // Check if subscription plan allows skill assessments
    const allowedPlans = ["Standard", "Professional", "STANDARD", "PROFESSIONAL"]; // Both plans allow skill assessments (case-insensitive)
    const planNameUpper = activeSubscription.plan.planName.toUpperCase();
    
    if (!allowedPlans.map(p => p.toUpperCase()).includes(planNameUpper)) {
      return res.status(403).json({
        success: false,
        message: "Your subscription plan does not include access to skill assessments",
        code: "PLAN_NOT_SUPPORTED",
        currentPlan: activeSubscription.plan.planName,
        requiredPlans: ["STANDARD", "PROFESSIONAL"],
      });
    }

    // Attach subscription info to response locals for potential use in controllers
    res.locals.subscription = {
      id: activeSubscription.id,
      planName: activeSubscription.plan.planName,
      planPrice: activeSubscription.plan.planPrice,
      endDate: activeSubscription.endDate,
      isActive: activeSubscription.isActive,
    };

    next();
  } catch (error) {
    console.error("Subscription verification error:", error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Middleware to check assessment attempt limits based on subscription plan
export const checkAssessmentLimits = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = res.locals.decrypt;
    const { subscription } = res.locals;

    if (!userId || !subscription) {
      return res.status(403).json({
        success: false,
        message: "Subscription verification required",
      });
    }

    // Define assessment limits per plan (updated according to requirements)
    const assessmentLimits: Record<string, number> = {
      Standard: 2, // 2 assessments per month for Standard plan
      STANDARD: 2, // Support uppercase
      Professional: -1, // Unlimited for Professional plan
      PROFESSIONAL: -1, // Support uppercase
    };

    const monthlyLimit = assessmentLimits[subscription.planName] || 2;

    // Skip limit check for unlimited plans (Professional)
    if (monthlyLimit === -1) {
      return next();
    }

    // Count assessments taken this month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const assessmentCount = await prisma.skillResult.count({
      where: {
        userId,
        createdAt: {
          gte: startOfMonth,
        },
      },
    });

    if (assessmentCount >= monthlyLimit) {
      const isStandardPlan = subscription.planName.toUpperCase() === 'STANDARD';
      return res.status(403).json({
        success: false,
        message: `Assessment limit reached. You can take ${monthlyLimit} skill assessments per month with your ${subscription.planName} plan (IDR ${isStandardPlan ? '25,000' : '100,000'}/month).`,
        code: "ASSESSMENT_LIMIT_EXCEEDED",
        currentCount: assessmentCount,
        limit: monthlyLimit,
        resetDate: new Date(startOfMonth.getFullYear(), startOfMonth.getMonth() + 1, 1),
        upgradeMessage: isStandardPlan ? "Upgrade to Professional plan (IDR 100,000/month) for unlimited skill assessments and priority job application review." : null,
      });
    }

    // Add remaining assessments info to response locals
    res.locals.assessmentInfo = {
      used: assessmentCount,
      limit: monthlyLimit,
      remaining: monthlyLimit - assessmentCount,
    };

    next();
  } catch (error) {
    console.error("Assessment limit check error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to check assessment limits",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
