import { Router } from "express";
import { PlanController } from "../controllers/subscription/plan.controller";
import { SubscriptionController } from "../controllers/subscription/subscription.controller";
import { PaymentController } from "../controllers/subscription/payment.controller";
import { verifyToken } from "../middlewares/verifyToken";
import { verifyRole } from "../middlewares/verifyRole";
import { uploadSingle } from "../middlewares/uploadImage";
import { UserRole } from "../generated/prisma";

class SubscriptionRouter {
  private route: Router;
  private planController: typeof PlanController;
  private subscriptionController: typeof SubscriptionController;
  private paymentController: typeof PaymentController;

  constructor() {
    this.route = Router();
    this.planController = PlanController;
    this.subscriptionController = SubscriptionController;
    this.paymentController = PaymentController;
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    // Get all plans (Developer + User)
    this.route.get("/plans", this.planController.getAllPlans);

    // Get plan by ID (Developer + User)
    this.route.get("/plans/:id", this.planController.getPlanById);

    // Create plan (Developer only)
    this.route.post(
      "/plans",
      verifyToken,
      verifyRole([UserRole.DEVELOPER]),
      this.planController.createPlan
    );

    // Update plan (Developer only)
    this.route.patch(
      "/plans/:id",
      verifyToken,
      verifyRole([UserRole.DEVELOPER]),
      this.planController.updatePlan
    );

    // Delete plan (Developer only)
    this.route.delete(
      "/plans/:id",
      verifyToken,
      verifyRole([UserRole.DEVELOPER]),
      this.planController.deletePlan
    );

    // Get all subscriptions (Developer only)
    this.route.get(
      "/subscriptions",
      verifyToken,
      verifyRole([UserRole.DEVELOPER]),
      this.subscriptionController.getAllSubscriptions
    );

    // Get subscription by ID (Developer only)
    this.route.get(
      "/subscriptions/:id",
      verifyToken,
      verifyRole([UserRole.DEVELOPER]),
      this.subscriptionController.getSubscriptionById
    );

    // Get user's subscriptions (Developer + User)
    this.route.get(
      "/my-subscriptions",
      verifyToken,
      this.subscriptionController.getUserSubscriptions
    );

    // Get user's active subscription (Developer + User)
    this.route.get(
      "/my-active-subscription",
      verifyToken,
      this.subscriptionController.getUserActiveSubscription
    );

    // User subscribe (Developer + User)
    this.route.post(
      "/subscribe",
      verifyToken,
      this.subscriptionController.subscribe
    );

    // Update subscription (Developer only)
    this.route.patch(
      "/subscriptions/:id",
      verifyToken,
      verifyRole([UserRole.DEVELOPER]),
      this.subscriptionController.updateSubscription
    );

    // Get all pending payments (Developer only)
    this.route.get(
      "/pending-payments",
      verifyToken,
      verifyRole([UserRole.DEVELOPER]),
      this.paymentController.getPendingPayments
    );

    // Get payment by ID (Developer only)
    this.route.get(
      "/payments/:id",
      verifyToken,
      verifyRole([UserRole.DEVELOPER]),
      this.paymentController.getPaymentById
    );

    // Upload payment proof (Developer + User)
    this.route.post(
      "/payments/:paymentId/upload-proof",
      verifyToken,
      uploadSingle("paymentProof"),
      this.paymentController.uploadPaymentProof
    );

    // Approve payment (Developer only)
    this.route.patch(
      "/payments/:id/approve",
      verifyToken,
      verifyRole([UserRole.DEVELOPER]),
      this.paymentController.approvePayment
    );

    // Reject payment (Developer only)
    this.route.patch(
      "/payments/:id/reject",
      verifyToken,
      verifyRole([UserRole.DEVELOPER]),
      this.paymentController.rejectPayment
    );

    // Get payments by subscription ID (Developer + User)
    this.route.get(
      "/subscriptions/:subscriptionId/payments",
      verifyToken,
      this.paymentController.getPaymentsBySubscriptionId
    );
  }

  public getRouter(): Router {
    return this.route;
  }
}

export default SubscriptionRouter;
