import { NextFunction, Request, Response } from "express";
import { PaymentService } from "../../services/subscription/payment.service";
import { cloudinaryUpload } from "../../config/cloudinary";
import { ControllerHelper } from "../../utils/controllerHelper";

export class PaymentController {
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

  public static async uploadPaymentProof(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const paymentId = ControllerHelper.parseId(req.params.paymentId);
      
      ControllerHelper.validateRequired({ file: req.file }, "Payment proof image is required");
      
      const cloudinaryResult = await cloudinaryUpload(req.file!);
      const payment = await PaymentService.uploadPaymentProof(paymentId, cloudinaryResult.secure_url);

      res.status(200).json({
        ...payment,
        cloudinary: {
          public_id: cloudinaryResult.public_id,
          secure_url: cloudinaryResult.secure_url,
          width: cloudinaryResult.width,
          height: cloudinaryResult.height,
          format: cloudinaryResult.format,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  public static async uploadPaymentProofBySlug(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { slug } = req.params;
      ControllerHelper.validateRequired({ slug }, "Payment slug is required");
      ControllerHelper.validateRequired({ file: req.file }, "Payment proof image is required");
      
      const cloudinaryResult = await cloudinaryUpload(req.file!);
      const payment = await PaymentService.uploadPaymentProofBySlug(slug!, cloudinaryResult.secure_url);

      res.status(200).json({
        ...payment,
        cloudinary: {
          public_id: cloudinaryResult.public_id,
          secure_url: cloudinaryResult.secure_url,
          width: cloudinaryResult.width,
          height: cloudinaryResult.height,
          format: cloudinaryResult.format,
        },
      });
    } catch (error) {
      next(error);
    }
  }

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

  public static async getPaymentsBySubscriptionId(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const subscriptionId = ControllerHelper.parseId(req.params.subscriptionId);
      const payments = await PaymentService.getPaymentsBySubscriptionId(subscriptionId);
      res.status(200).json(payments);
    } catch (error) {
      next(error);
    }
  }
}
