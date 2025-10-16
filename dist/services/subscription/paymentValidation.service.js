"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentValidationService = void 0;
const payment_repository_1 = require("../../repositories/subscription/payment.repository");
const customError_1 = require("../../utils/customError");
class PaymentValidationService {
    static async validatePaymentExists(id) {
        const payment = await payment_repository_1.PaymentRepo.getPaymentById(id);
        if (!payment) {
            throw new customError_1.CustomError("Payment not found", 404);
        }
        return payment;
    }
    static validatePaymentStatus(payment, expectedStatus = "PENDING") {
        if (payment.status !== expectedStatus) {
            throw new customError_1.CustomError(`Payment is not in ${expectedStatus.toLowerCase()} status`, 400);
        }
    }
}
exports.PaymentValidationService = PaymentValidationService;
