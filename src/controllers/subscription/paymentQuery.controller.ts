import { NextFunction, Request, Response } from "express";
import { PaymentService } from "../../services/subscription/payment.service";
import { ControllerHelper } from "../../utils/controllerHelper";

export class PaymentQueryController {
  public static async getPendingPayments(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const payments = await PaymentService.getPendingPayments();
      res.status(200).json(payments);
    } catch (error) {
      next(error);
    }
  }

  public static async getPaymentById(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const id = ControllerHelper.parseId(req.params.id);
      const payment = await PaymentService.getPaymentById(id);
      res.status(200).json(payment);
    } catch (error) {
      next(error);
    }
  }

  public static async getPaymentBySlug(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { slug } = req.params;
      ControllerHelper.validateRequired({ slug }, "Payment slug is required");
      const payment = await PaymentService.getPaymentBySlugOrId(slug!);
      res.status(200).json(payment);
    } catch (error) {
      next(error);
    }
  }

  public static async getPaymentsBySubscriptionId(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const subscriptionId = ControllerHelper.parseId(
        req.params.subscriptionId
      );
      const payments = await PaymentService.getPaymentsBySubscriptionId(
        subscriptionId
      );
      res.status(200).json(payments);
    } catch (error) {
      next(error);
    }
  }
}
