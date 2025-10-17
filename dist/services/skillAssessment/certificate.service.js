"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CertificateService = void 0;
const uploadBuffer_1 = require("../../utils/uploadBuffer");
const uuid_1 = require("uuid");
const stream_1 = require("stream");
const pdfGeneration_service_1 = require("./pdfGeneration.service");
class CertificateService {
    static async generateCertificate(data) {
        const certificateCode = `CERT-${(0, uuid_1.v4)().toUpperCase().substring(0, 8)}`;
        // Generate PDF using dedicated service
        const pdfBuffer = await pdfGeneration_service_1.PDFGenerationService.generateCertificatePDF({
            ...data,
            certificateCode,
        });
        // Upload to Cloudinary
        const fileName = `certificates/certificate-${certificateCode}.pdf`;
        const uploadResult = await (0, uploadBuffer_1.uploadToCloudinary)(stream_1.Readable.from(pdfBuffer), fileName);
        return {
            certificateUrl: uploadResult.secure_url,
            certificateCode,
        };
    }
    static generateQRCodeData(certificateCode) {
        // Return verification URL for QR code
        return `${process.env.FE_URL || "http://localhost:3000"}/verify-certificate/${certificateCode}`;
    }
    static async verifyCertificate(certificateCode) {
        // This will be called by the repository
        return {
            isValid: true,
            verificationUrl: this.generateQRCodeData(certificateCode),
        };
    }
}
exports.CertificateService = CertificateService;
