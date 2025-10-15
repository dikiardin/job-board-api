"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentController = void 0;
const paymentQuery_controller_1 = require("./paymentQuery.controller");
const paymentUpload_controller_1 = require("./paymentUpload.controller");
const paymentAction_controller_1 = require("./paymentAction.controller");
class PaymentController {
    static async getPendingPayments(req, res, next) {
        return paymentQuery_controller_1.PaymentQueryController.getPendingPayments(req, res, next);
    }
    static async getPaymentById(req, res, next) {
        return paymentQuery_controller_1.PaymentQueryController.getPaymentById(req, res, next);
    }
    static async getPaymentBySlug(req, res, next) {
        return paymentQuery_controller_1.PaymentQueryController.getPaymentBySlug(req, res, next);
    }
    static async uploadPaymentProof(req, res, next) {
        return paymentUpload_controller_1.PaymentUploadController.uploadPaymentProof(req, res, next);
    }
    static async uploadPaymentProofBySlug(req, res, next) {
        return paymentUpload_controller_1.PaymentUploadController.uploadPaymentProofBySlug(req, res, next);
    }
    static async approvePayment(req, res, next) {
        return paymentAction_controller_1.PaymentActionController.approvePayment(req, res, next);
    }
    static async approvePaymentBySlug(req, res, next) {
        return paymentAction_controller_1.PaymentActionController.approvePaymentBySlug(req, res, next);
    }
    static async rejectPayment(req, res, next) {
        return paymentAction_controller_1.PaymentActionController.rejectPayment(req, res, next);
    }
    static async rejectPaymentBySlug(req, res, next) {
        return paymentAction_controller_1.PaymentActionController.rejectPaymentBySlug(req, res, next);
    }
    static async getPaymentsBySubscriptionId(req, res, next) {
        return paymentQuery_controller_1.PaymentQueryController.getPaymentsBySubscriptionId(req, res, next);
    }
}
exports.PaymentController = PaymentController;
//# sourceMappingURL=payment.controller.js.map