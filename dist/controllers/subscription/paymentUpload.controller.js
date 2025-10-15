"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentUploadController = void 0;
const payment_service_1 = require("../../services/subscription/payment.service");
const cloudinary_1 = require("../../config/cloudinary");
const controllerHelper_1 = require("../../utils/controllerHelper");
class PaymentUploadController {
    static async uploadPaymentProof(req, res, next) {
        try {
            const paymentId = controllerHelper_1.ControllerHelper.parseId(req.params.paymentId);
            controllerHelper_1.ControllerHelper.validateRequired({ file: req.file }, "Payment proof image is required");
            const cloudinaryResult = await (0, cloudinary_1.cloudinaryUpload)(req.file);
            const payment = await payment_service_1.PaymentService.uploadPaymentProof(paymentId, cloudinaryResult.secure_url);
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
        }
        catch (error) {
            next(error);
        }
    }
    static async uploadPaymentProofBySlug(req, res, next) {
        try {
            const { slug } = req.params;
            controllerHelper_1.ControllerHelper.validateRequired({ slug }, "Payment slug is required");
            controllerHelper_1.ControllerHelper.validateRequired({ file: req.file }, "Payment proof image is required");
            const cloudinaryResult = await (0, cloudinary_1.cloudinaryUpload)(req.file);
            const payment = await payment_service_1.PaymentService.uploadPaymentProofBySlug(slug, cloudinaryResult.secure_url);
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
        }
        catch (error) {
            next(error);
        }
    }
}
exports.PaymentUploadController = PaymentUploadController;
//# sourceMappingURL=paymentUpload.controller.js.map