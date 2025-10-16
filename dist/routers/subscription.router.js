"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const plan_controller_1 = require("../controllers/subscription/plan.controller");
const subscription_controller_1 = require("../controllers/subscription/subscription.controller");
const payment_controller_1 = require("../controllers/subscription/payment.controller");
const verifyToken_1 = require("../middlewares/verifyToken");
const verifyRole_1 = require("../middlewares/verifyRole");
const uploadImage_1 = require("../middlewares/uploadImage");
const subscription_validator_1 = require("../middlewares/validator/subscription.validator");
const prisma_1 = require("../generated/prisma");
class SubscriptionRouter {
    constructor() {
        this.route = (0, express_1.Router)();
        this.planController = plan_controller_1.PlanController;
        this.subscriptionController = subscription_controller_1.SubscriptionController;
        this.paymentController = payment_controller_1.PaymentController;
        this.initializeRoutes();
    }
    initializeRoutes() {
        // Get all plans (Developer + User)
        this.route.get("/plans", this.planController.getAllPlans);
        // Get plan by ID (Developer + User)
        this.route.get("/plans/:id", this.planController.getPlanById);
        // Create plan (Developer only)
        this.route.post("/plans", verifyToken_1.verifyToken, (0, verifyRole_1.verifyRole)([prisma_1.UserRole.DEVELOPER]), this.planController.createPlan);
        // Update plan (Developer only)
        this.route.patch("/plans/:id", verifyToken_1.verifyToken, (0, verifyRole_1.verifyRole)([prisma_1.UserRole.DEVELOPER]), this.planController.updatePlan);
        // Delete plan (Developer only)
        this.route.delete("/plans/:id", verifyToken_1.verifyToken, (0, verifyRole_1.verifyRole)([prisma_1.UserRole.DEVELOPER]), this.planController.deletePlan);
        // Get all subscriptions (Developer only)
        this.route.get("/subscriptions", verifyToken_1.verifyToken, (0, verifyRole_1.verifyRole)([prisma_1.UserRole.DEVELOPER]), this.subscriptionController.getAllSubscriptions);
        // Get subscription by ID (Developer only)
        this.route.get("/subscriptions/:id", verifyToken_1.verifyToken, (0, verifyRole_1.verifyRole)([prisma_1.UserRole.DEVELOPER]), this.subscriptionController.getSubscriptionById);
        // Get user's subscriptions (Developer + User)
        this.route.get("/my-subscriptions", verifyToken_1.verifyToken, this.subscriptionController.getUserSubscriptions);
        // Get user's active subscription (Developer + User)
        this.route.get("/my-active-subscription", verifyToken_1.verifyToken, this.subscriptionController.getUserActiveSubscription);
        // User subscribe (Developer + User)
        this.route.post("/subscribe", verifyToken_1.verifyToken, subscription_validator_1.SubscriptionValidator.validateSubscribeRequest, this.subscriptionController.subscribe);
        // Update subscription (Developer only)
        this.route.patch("/subscriptions/:id", verifyToken_1.verifyToken, (0, verifyRole_1.verifyRole)([prisma_1.UserRole.DEVELOPER]), this.subscriptionController.updateSubscription);
        // Get all pending payments (Developer only)
        this.route.get("/pending-payments", verifyToken_1.verifyToken, (0, verifyRole_1.verifyRole)([prisma_1.UserRole.DEVELOPER]), this.paymentController.getPendingPayments);
        // Get payment by ID (Developer only)
        this.route.get("/payments/:id", verifyToken_1.verifyToken, (0, verifyRole_1.verifyRole)([prisma_1.UserRole.DEVELOPER]), this.paymentController.getPaymentById);
        // Get payment by slug (Developer only) - More secure
        this.route.get("/payments/slug/:slug", verifyToken_1.verifyToken, (0, verifyRole_1.verifyRole)([prisma_1.UserRole.DEVELOPER]), this.paymentController.getPaymentBySlug);
        // Upload payment proof (Developer + User)
        this.route.post("/payments/:paymentId/upload-proof", verifyToken_1.verifyToken, (0, uploadImage_1.uploadPaymentProofSingle)("paymentProof"), this.paymentController.uploadPaymentProof);
        // Upload payment proof by slug (Developer + User) - More secure
        this.route.post("/payments/slug/:slug/upload-proof", verifyToken_1.verifyToken, (0, uploadImage_1.uploadPaymentProofSingle)("paymentProof"), this.paymentController.uploadPaymentProofBySlug);
        // Approve payment (Developer only)
        this.route.patch("/payments/:id/approve", verifyToken_1.verifyToken, (0, verifyRole_1.verifyRole)([prisma_1.UserRole.DEVELOPER]), this.paymentController.approvePayment);
        // Approve payment by slug (Developer only) - More secure
        this.route.patch("/payments/slug/:slug/approve", verifyToken_1.verifyToken, (0, verifyRole_1.verifyRole)([prisma_1.UserRole.DEVELOPER]), this.paymentController.approvePaymentBySlug);
        // Reject payment (Developer only)
        this.route.patch("/payments/:id/reject", verifyToken_1.verifyToken, (0, verifyRole_1.verifyRole)([prisma_1.UserRole.DEVELOPER]), this.paymentController.rejectPayment);
        // Reject payment by slug (Developer only) - More secure
        this.route.patch("/payments/slug/:slug/reject", verifyToken_1.verifyToken, (0, verifyRole_1.verifyRole)([prisma_1.UserRole.DEVELOPER]), this.paymentController.rejectPaymentBySlug);
        // Get payments by subscription ID (Developer + User)
        this.route.get("/subscriptions/:subscriptionId/payments", verifyToken_1.verifyToken, this.paymentController.getPaymentsBySubscriptionId);
        // Get renewal info (Developer + User)
        this.route.get("/renewal-info", verifyToken_1.verifyToken, this.subscriptionController.getRenewalInfo);
        // Renew subscription (Developer + User)
        this.route.post("/renew", verifyToken_1.verifyToken, this.subscriptionController.renewSubscription);
    }
    getRouter() {
        return this.route;
    }
}
exports.default = SubscriptionRouter;
