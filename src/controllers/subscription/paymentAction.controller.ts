import { NextFunction, Request, Response } from "express";
import { PaymentService } from "../../services/subscription/payment.service";
import { ControllerHelper } from "../../utils/controllerHelper";

export class PaymentActionController {
  public static async approvePayment(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const id = ControllerHelper.parseId(req.params.id);
      const payment = await PaymentService.approvePayment(id);
      res.status(200).json(payment);
    } catch (error) {
      next(error);
    }
  }

  public static async approvePaymentBySlug(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { slug } = req.params;
      ControllerHelper.validateRequired({ slug }, "Payment slug is required");
      const payment = await PaymentService.approvePaymentBySlug(slug!);
      res.status(200).json(payment);
    } catch (error) {
      next(error);
    }
  }

  public static async rejectPayment(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const id = ControllerHelper.parseId(req.params.id);
      const payment = await PaymentService.rejectPayment(id);
      res.status(200).json(payment);
    } catch (error) {
      next(error);
    }
  }

  public static async rejectPaymentBySlug(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { slug } = req.params;
      ControllerHelper.validateRequired({ slug }, "Payment slug is required");
      const payment = await PaymentService.rejectPaymentBySlug(slug!);
      res.status(200).json(payment);
    } catch (error) {
      next(error);
    }
  }
}
