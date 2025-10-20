import { Router } from "express";
import { PlanController } from "../controllers/subscription/plan.controller";
import { SubscriptionController } from "../controllers/subscription/subscription.controller";
import { PaymentController } from "../controllers/subscription/payment.controller";
import { verifyToken } from "../middlewares/verifyToken";
import { verifyRole } from "../middlewares/verifyRole";
import {
  uploadSingle,
  uploadPaymentProofSingle,
} from "../middlewares/uploadImage";
import { SubscriptionValidator } from "../middlewares/validator/subscription.validator";
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
    this.initializePlanRoutes();
    this.initializeSubscriptionRoutes();
    this.initializePaymentRoutes();
  }

  private initializePlanRoutes(): void {
    this.route.get("/plans", this.planController.getAllPlans);

    this.route.get("/plans/:id", this.planController.getPlanById);

    this.route.post(
      "/plans",
      verifyToken,
      verifyRole([UserRole.DEVELOPER]),
      this.planController.createPlan
    );

    this.route.patch(
      "/plans/:id",
      verifyToken,
      verifyRole([UserRole.DEVELOPER]),
      this.planController.updatePlan
    );

    this.route.delete(
      "/plans/:id",
      verifyToken,
      verifyRole([UserRole.DEVELOPER]),
      this.planController.deletePlan
    );
  }

  private initializeSubscriptionRoutes(): void {
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
      SubscriptionValidator.validateSubscribeRequest,
      this.subscriptionController.subscribe
    );

    this.route.patch(
      "/subscriptions/:id",
      verifyToken,
      verifyRole([UserRole.DEVELOPER]),
      this.subscriptionController.updateSubscription
    );

    this.route.get(
      "/renewal-info",
      verifyToken,
      this.subscriptionController.getRenewalInfo
    );
    this.route.post(
      "/renew",
      verifyToken,
      this.subscriptionController.renewSubscription
    );
  }

  private initializePaymentRoutes(): void {
    this.route.get(
      "/pending-payments",
      verifyToken,
      verifyRole([UserRole.DEVELOPER]),
      this.paymentController.getPendingPayments
    );

    this.route.get(
      "/payments/:id",
      verifyToken,
      verifyRole([UserRole.DEVELOPER]),
      this.paymentController.getPaymentById
    );

    this.route.get(
      "/payments/slug/:slug",
      verifyToken,
      verifyRole([UserRole.DEVELOPER]),
      this.paymentController.getPaymentBySlug
    );

    this.route.post(
      "/payments/:paymentId/upload-proof",
      verifyToken,
      uploadPaymentProofSingle("paymentProof"),
      this.paymentController.uploadPaymentProof
    );

    this.route.post(
      "/payments/slug/:slug/upload-proof",
      verifyToken,
      uploadPaymentProofSingle("paymentProof"),
      this.paymentController.uploadPaymentProofBySlug
    );

    this.route.patch(
      "/payments/:id/approve",
      verifyToken,
      verifyRole([UserRole.DEVELOPER]),
      this.paymentController.approvePayment
    );

    this.route.patch(
      "/payments/slug/:slug/approve",
      verifyToken,
      verifyRole([UserRole.DEVELOPER]),
      this.paymentController.approvePaymentBySlug
    );

    this.route.patch(
      "/payments/:id/reject",
      verifyToken,
      verifyRole([UserRole.DEVELOPER]),
      this.paymentController.rejectPayment
    );

    this.route.patch(
      "/payments/slug/:slug/reject",
      verifyToken,
      verifyRole([UserRole.DEVELOPER]),
      this.paymentController.rejectPaymentBySlug
    );

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
