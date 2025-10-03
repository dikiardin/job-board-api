import { PaymentRepo } from "../../repositories/subscription/payment.repository";
import { CustomError } from "../../utils/customError";

export class PaymentValidationService {
  public static async validatePaymentExists(id: number) {
    const payment = await PaymentRepo.getPaymentById(id);
    if (!payment) {
      throw new CustomError("Payment not found", 404);
    }
    return payment;
  }

  public static validatePaymentStatus(payment: any, expectedStatus: string = "PENDING") {
    if (payment.status !== expectedStatus) {
      throw new CustomError(`Payment is not in ${expectedStatus.toLowerCase()} status`, 400);
    }
  }
}
