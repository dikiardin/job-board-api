import { NextFunction, Request, Response } from "express";
import { PaymentService } from "../../services/subscription/payment.service";
import { cloudinaryUpload } from "../../config/cloudinary";

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
      const { id } = req.params;
      const payment = await PaymentService.getPaymentById(parseInt(id!));
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
      const { paymentId } = req.params;

      // Check if file was uploaded
      if (!req.file) {
        return res
          .status(400)
          .json({ message: "Payment proof image is required" });
      }

      // Upload to Cloudinary
      const cloudinaryResult = await cloudinaryUpload(req.file);

      const payment = await PaymentService.uploadPaymentProof(
        parseInt(paymentId!),
        cloudinaryResult.secure_url
      );

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
      console.error("Upload payment proof error:", error);
      next(error);
    }
  }

  public static async approvePayment(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params;
      const payment = await PaymentService.approvePayment(parseInt(id!));

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
      const { id } = req.params;
      const payment = await PaymentService.rejectPayment(parseInt(id!));

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
      const { subscriptionId } = req.params;
      const payments = await PaymentService.getPaymentsBySubscriptionId(
        parseInt(subscriptionId!)
      );

      res.status(200).json(payments);
    } catch (error) {
      next(error);
    }
  }
}
