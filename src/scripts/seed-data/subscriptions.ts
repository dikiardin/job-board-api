import {
  PaymentMethod,
  PaymentStatus,
  Prisma,
  PrismaClient,
  Subscription,
  SubscriptionPlan,
  SubscriptionPlanCode,
  SubscriptionStatus,
} from "../../generated/prisma";
import { SeedUsersResult } from "./users";
interface SeedSubscriptionsOptions {
  prisma: PrismaClient;
  now: Date;
  addDays: (days: number) => Date;
  users: SeedUsersResult;
}
export interface SeedSubscriptionsResult {
  standardPlan: SubscriptionPlan;
  professionalPlan: SubscriptionPlan;
  ginaProfessional: Subscription;
}
export async function seedSubscriptions({
  prisma,
  now,
  addDays,
  users,
}: SeedSubscriptionsOptions): Promise<SeedSubscriptionsResult> {
  const [standardPlan, professionalPlan] = await Promise.all([
    prisma.subscriptionPlan.create({
      data: {
        code: SubscriptionPlanCode.STANDARD,
        name: "Standard",
        description: "Standard plan unlocking CV generator and 2 assessments per month.",
        priceIdr: 25_000,
        perks: [
          "ATS CV Generator",
          "2 Skill Assessments per month",
          "Basic email reminders",
        ],
        monthlyAssessmentQuota: 2,
        priorityCvReview: false,
        cvGeneratorEnabled: true,
      },
    }),
    prisma.subscriptionPlan.create({
      data: {
        code: SubscriptionPlanCode.PROFESSIONAL,
        name: "Professional",
        description: "Professional plan with unlimited assessments and priority review.",
        priceIdr: 100_000,
        perks: [
          "ATS CV Generator",
          "Unlimited Skill Assessments",
          "Priority CV Review",
          "Exclusive templates",
        ],
        monthlyAssessmentQuota: null,
        priorityCvReview: true,
        cvGeneratorEnabled: true,
      },
    }),
  ]);
  const { developer, seekers } = users;
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
      status: SubscriptionStatus.ACTIVE,
      startDate: now,
      paidAt: now,
      expiresAt: thirtyDaysLater,
      approvedByDeveloperId: developer.id,
      lastReminderSentAt: addDays(29),
      payments: {
        create: {
          amount: new Prisma.Decimal(100_000),
          paymentMethod: PaymentMethod.TRANSFER,
          status: PaymentStatus.APPROVED,
          paymentProof: "https://res.cloudinary.com/demo/payments/alice-transfer.jpg",
          paidAt: now,
          approvedAt: now,
          approvedById: developer.id,
          referenceCode: "PRO-INV-ALICE-001",
        },
      },
      usage: {
        create: {
          assessmentsUsed: 3,
          cvGenerated: 2,
          priorityReviews: 1,
          periodStart: now,
          periodEnd: thirtyDaysLater,
        },
      },
    },
  });
  await prisma.subscription.create({
    data: {
      userId: seekers.bob.id,
      planId: standardPlan.id,
      status: SubscriptionStatus.PENDING,
      paymentMethod: PaymentMethod.TRANSFER,
      proofUrl: "https://res.cloudinary.com/demo/payments/bob-proof.jpg",
      payments: {
        create: {
          amount: new Prisma.Decimal(25_000),
          paymentMethod: PaymentMethod.TRANSFER,
          status: PaymentStatus.PENDING,
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
      status: SubscriptionStatus.EXPIRED,
      startDate: sixtyDaysAgo,
      paidAt: sixtyDaysAgo,
      expiresAt: thirtyDaysAgo,
      lastReminderSentAt: thirtyDaysAgo,
      payments: {
        create: {
          amount: new Prisma.Decimal(100_000),
          paymentMethod: PaymentMethod.TRANSFER,
          status: PaymentStatus.APPROVED,
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
      status: SubscriptionStatus.ACTIVE,
      startDate: now,
      paidAt: now,
      expiresAt: fifteenDaysLater,
      paymentMethod: PaymentMethod.GATEWAY,
      payments: {
        create: {
          amount: new Prisma.Decimal(100_000),
          paymentMethod: PaymentMethod.GATEWAY,
          status: PaymentStatus.APPROVED,
          paidAt: now,
          gatewayTransactionId: "GATEWAY-8821",
          referenceCode: "PRO-INV-GINA-002",
        },
      },
      usage: {
        create: {
          assessmentsUsed: 1,
          cvGenerated: 1,
          priorityReviews: 1,
          periodStart: now,
          periodEnd: fifteenDaysLater,
        },
      },
    },
  });
  await prisma.subscription.create({
    data: {
      userId: seekers.eko.id,
      planId: standardPlan.id,
      status: SubscriptionStatus.CANCELLED,
      startDate: fortyDaysAgo,
      paidAt: fortyDaysAgo,
      expiresAt: twelveDaysAgo,
      cancelledAt: tenDaysAgo,
      lastReminderSentAt: elevenDaysAgo,
      payments: {
        create: {
          amount: new Prisma.Decimal(25_000),
          paymentMethod: PaymentMethod.TRANSFER,
          status: PaymentStatus.APPROVED,
          paidAt: fortyDaysAgo,
          approvedAt: fortyDaysAgo,
          approvedById: developer.id,
          referenceCode: "STD-INV-EKO-001",
        },
      },
    },
  });
  return { standardPlan, professionalPlan, ginaProfessional };
}



