import { Request, Response, NextFunction } from "express";
import { prisma } from "../config/prisma";
import { SubscriptionStatus } from "../generated/prisma";

const ASSESSMENT_LIMITS: Record<string, number> = {
  STANDARD: 2,
  PROFESSIONAL: -1,
};

export const verifySubscription = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = res.locals.decrypt;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Authentication required" });
    }

    // Check for ACTIVE subscription first
    let subscription = await prisma.subscription.findFirst({
      where: {
        userId,
        status: SubscriptionStatus.ACTIVE,
        expiresAt: { gt: new Date() },
      },
      include: { plan: true },
    });

    // If no active subscription, check for recent PENDING subscription (within 24 hours)
    if (!subscription) {
      const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      subscription = await prisma.subscription.findFirst({
        where: {
          userId,
          status: SubscriptionStatus.PENDING,
          createdAt: { gte: twentyFourHoursAgo },
        },
        include: { plan: true },
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
  } catch (error) {
    console.error("Subscription verification error:", error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const checkAssessmentLimits = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = res.locals.decrypt;
    const { subscription } = res.locals;

    if (!userId || !subscription) {
      return res.status(403).json({ success: false, message: "Subscription verification required" });
    }

    const planKey = subscription.planCode.toUpperCase();
    const monthlyLimit = ASSESSMENT_LIMITS[planKey] ?? 2;

    // Professional users have unlimited assessments
    if (monthlyLimit === -1) {
      return next();
    }

    // Get assessment ID from request params
    const assessmentId = parseInt(req.params.assessmentId || req.body.assessmentId);
    
    if (!assessmentId) {
      return next(); // Skip check if no assessment ID
    }

    // Check if user has already taken this specific assessment
    const existingResult = await prisma.skillResult.findFirst({
      where: {
        userId: userId,
        assessmentId: assessmentId,
      },
    });

    // If user has already taken this assessment, allow retake (no additional count)
    if (existingResult) {
      return next();
    }

    // Count total unique assessments taken this month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const uniqueAssessmentsTaken = await prisma.skillResult.groupBy({
      by: ['assessmentId'],
      where: {
        userId: userId,
        createdAt: { gte: startOfMonth },
      },
    });

    const totalAssessmentsTaken = uniqueAssessmentsTaken.length;

    // Block if user has reached monthly limit for NEW assessments
    if (totalAssessmentsTaken >= monthlyLimit) {
      const resetDate = new Date(startOfMonth);
      resetDate.setMonth(resetDate.getMonth() + 1);
      const isStandard = planKey === "STANDARD";

      return res.status(403).json({
        success: false,
        message: `Monthly assessment limit reached. You have taken ${totalAssessmentsTaken} assessments this month. ${subscription.planName} plan allows ${monthlyLimit} assessments per month.`,
        code: "ASSESSMENT_LIMIT_EXCEEDED",
        currentCount: totalAssessmentsTaken,
        limit: monthlyLimit,
        resetDate,
        upgradeMessage: isStandard
          ? "Upgrade to Professional plan (IDR 100,000/month) for unlimited assessments and priority review."
          : null,
      });
    }

    next();
  } catch (error) {
    console.error("Error checking assessment limits:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to verify assessment limits",
    });
  }
};
