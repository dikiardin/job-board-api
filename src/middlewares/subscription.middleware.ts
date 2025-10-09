import { Response, NextFunction } from "express";
import { prisma } from "../config/prisma";
import { AuthRequest } from "./auth.middleware";
import { SubscriptionStatus } from "../generated/prisma";

export interface SubscriptionLimits {
  cvGenerationLimit: number;
  templatesAccess: string[];
  additionalFeatures: string[];
}

const SUBSCRIPTION_LIMITS: Record<string, SubscriptionLimits> = {
  Standard: {
    cvGenerationLimit: 2,
    templatesAccess: ["ats", "modern"],
    additionalFeatures: ["cv_generator", "skill_assessment_2x"],
  },
  Professional: {
    cvGenerationLimit: -1,
    templatesAccess: ["ats", "modern", "creative"],
    additionalFeatures: ["cv_generator", "skill_assessment_unlimited", "priority_review"],
  },
};

export const checkSubscription = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const activeSubscription = await prisma.subscription.findFirst({
      where: {
        userId,
        status: SubscriptionStatus.ACTIVE,
        expiresAt: { gt: new Date() },
      },
      include: { plan: true },
    });

    if (!activeSubscription) {
      return res.status(403).json({
        message:
          "Active subscription required to access this feature. Choose Standard (IDR 25,000/month) or Professional (IDR 100,000/month).",
        code: "SUBSCRIPTION_REQUIRED",
      });
    }

    req.subscription = {
      plan: activeSubscription.plan,
      limits: SUBSCRIPTION_LIMITS[activeSubscription.plan.name] ?? SUBSCRIPTION_LIMITS.Standard,
      expiresAt: activeSubscription.expiresAt,
    };

    next();
  } catch (error) {
    console.error("Subscription check error:", error);
    res.status(500).json({
      message: "Failed to verify subscription",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const checkCVGenerationLimit = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;
    const limits = req.subscription?.limits;

    if (!userId || !limits) {
      return res
        .status(403)
        .json({ message: "Subscription verification failed" });
    }

    if (limits.cvGenerationLimit === -1) {
      return next();
    }

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const cvCount = await prisma.generatedCV.count({
      where: {
        userId,
        createdAt: { gte: startOfMonth },
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
  } catch (error) {
    console.error("CV generation limit check error:", error);
    res.status(500).json({
      message: "Failed to check generation limit",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const checkTemplateAccess = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
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
