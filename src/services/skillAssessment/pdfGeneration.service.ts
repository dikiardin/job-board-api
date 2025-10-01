import { PDFLayoutService } from "./pdfLayout.service";

export class PDFGenerationService {
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
    // Delegate to PDF layout service
    return await PDFLayoutService.generateCertificatePDF(data);
  }
}
