import { uploadToCloudinary } from "../../utils/uploadBuffer";
import { v4 as uuidv4 } from "uuid";
import { Readable } from "stream";
import { PDFGenerationService } from "./pdfGeneration.service";

export class CertificateService {
  public static async generateCertificate(data: {
    userName: string;
    userEmail: string;
    assessmentTitle: string;
    assessmentDescription?: string;
    score: number;
    totalQuestions: number;
    completedAt: Date;
    userId: number;
    badgeIcon?: string;
    badgeName?: string;
  }): Promise<{ certificateUrl: string; certificateCode: string }> {
    const certificateCode = `CERT-${uuidv4().toUpperCase().substring(0, 8)}`;

    // Generate PDF using dedicated service
    const pdfBuffer = await PDFGenerationService.generateCertificatePDF({
      ...data,
      certificateCode,
    });

    // Upload to Cloudinary
    const fileName = `certificates/certificate-${certificateCode}.pdf`;
    const uploadResult = await uploadToCloudinary(
      Readable.from(pdfBuffer),
      fileName
    );

    return {
      certificateUrl: uploadResult.secure_url,
      certificateCode,
    };
  }

  public static generateQRCodeData(certificateCode: string): string {
    // Return verification URL for QR code
    return `${
      process.env.FRONTEND_URL || "http://localhost:3000"
    }/verify-certificate/${certificateCode}`;
  }

  public static async verifyCertificate(certificateCode: string) {
    // This will be called by the repository
    return {
      isValid: true,
      verificationUrl: this.generateQRCodeData(certificateCode),
    };
  }
}
