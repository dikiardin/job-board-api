import { NextFunction, Request, Response } from "express";
import { PaymentQueryController } from "./paymentQuery.controller";
import { PaymentUploadController } from "./paymentUpload.controller";
import { PaymentActionController } from "./paymentAction.controller";

export class PaymentController {
  public static async getPendingPayments(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    return PaymentQueryController.getPendingPayments(req, res, next);
  }

  public static async getPaymentById(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    return PaymentQueryController.getPaymentById(req, res, next);
  }

  public static async getPaymentBySlug(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    return PaymentQueryController.getPaymentBySlug(req, res, next);
  }

  public static async uploadPaymentProof(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    return PaymentUploadController.uploadPaymentProof(req, res, next);
  }

  public static async uploadPaymentProofBySlug(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    return PaymentUploadController.uploadPaymentProofBySlug(req, res, next);
  }

  public static async approvePayment(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    return PaymentActionController.approvePayment(req, res, next);
  }

  public static async approvePaymentBySlug(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    return PaymentActionController.approvePaymentBySlug(req, res, next);
  }

  public static async rejectPayment(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    return PaymentActionController.rejectPayment(req, res, next);
  }

  public static async rejectPaymentBySlug(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    return PaymentActionController.rejectPaymentBySlug(req, res, next);
  }

  public static async getPaymentsBySubscriptionId(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    return PaymentQueryController.getPaymentsBySubscriptionId(req, res, next);
  }
}
