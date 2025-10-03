import * as PDFKit from "pdfkit";

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
    badgeIcon?: string;
  }): Promise<Buffer> {
    // Create PDF document
    const doc = new PDFKit.default({
      size: "A4",
      margin: 50,
    });

    // Add certificate content
    doc.fontSize(24).text("Certificate of Achievement", { align: "center" });
    doc.moveDown();
    
    doc.fontSize(16).text("This is to certify that", { align: "center" });
    doc.fontSize(20).text(data.userName, { align: "center" });
    doc.moveDown();
    
    doc.fontSize(14).text("has successfully completed the assessment:", { align: "center" });
    doc.fontSize(16).text(data.assessmentTitle, { align: "center" });
    doc.moveDown();
    
    doc.fontSize(12).text(`Score: ${data.score}/${data.totalQuestions}`, { align: "center" });
    doc.text(`Completed on: ${data.completedAt.toDateString()}`, { align: "center" });
    doc.text(`Certificate Code: ${data.certificateCode}`, { align: "center" });

    // Finalize PDF
    doc.end();

    // Convert to buffer
    const chunks: Buffer[] = [];
    return new Promise((resolve, reject) => {
      doc.on("data", (chunk) => chunks.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(chunks)));
      doc.on("error", reject);
    });
  }
}
