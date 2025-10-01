import * as PDFKit from "pdfkit";
import { QRCodeGenerationService } from "./qrCodeGeneration.service";
import { PDFContentService } from "./pdfContent.service";

export class PDFLayoutService {
  public static async generateCertificatePDF(data: {
    userName: string;
    userEmail: string;
    assessmentTitle: string;
    assessmentDescription?: string;
    score: number;
    totalQuestions: number;
    completedAt: Date;
    userId: number;
    certificateCode: string;
  }): Promise<Buffer> {
    // Create PDF document
    const doc = new PDFKit.default({
      size: "A4",
      layout: "landscape",
      margins: { top: 40, bottom: 40, left: 60, right: 60 },
      bufferPages: true,
    });

    // Add header and content using PDFContentService
    PDFContentService.addHeader(doc);
    PDFContentService.addCertificateBody(doc, data);
    PDFContentService.addScoreSection(doc, data);
    PDFContentService.addDatesSection(doc, data);
    
    // Add QR code
    const qrY = PDFContentService.calculateQRPosition(data);
    await QRCodeGenerationService.addQRCodeToPDF(doc, data.certificateCode, qrY);
    
    // Add footer
    PDFContentService.addFooter(doc, qrY);

    // Ensure single page
    if (doc.bufferedPageRange().count > 1) {
      console.warn("Certificate generated multiple pages, content may be too large");
    }

    // End the document
    doc.end();

    // Convert PDF to buffer
    return PDFContentService.convertToBuffer(doc);
  }
}
