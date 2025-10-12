import { NextFunction, Request, Response } from "express";
import { PaymentService } from "../../services/subscription/payment.service";
import { cloudinaryUpload } from "../../config/cloudinary";
import { ControllerHelper } from "../../utils/controllerHelper";

export class PaymentUploadController {
  public static async uploadPaymentProof(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const paymentId = ControllerHelper.parseId(req.params.paymentId);

      ControllerHelper.validateRequired(
        { file: req.file },
        "Payment proof image is required"
      );

      const cloudinaryResult = await cloudinaryUpload(req.file!);
      const payment = await PaymentService.uploadPaymentProof(
        paymentId,
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
      ControllerHelper.validateRequired(
        { file: req.file },
        "Payment proof image is required"
      );

      const cloudinaryResult = await cloudinaryUpload(req.file!);
      const payment = await PaymentService.uploadPaymentProofBySlug(
        slug!,
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
      next(error);
    }
  }
}
