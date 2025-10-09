import * as PDFKit from "pdfkit";
import * as path from "path";
import * as fs from "fs";
import * as QRCode from "qrcode";
import { PDFLayoutHelper } from "./helpers/PDFLayoutHelper";

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
    badgeName?: string;
  }): Promise<Buffer> {
    const doc = new PDFKit.default({
      size: "A4",
      layout: "landscape",
      margin: 40,
    });

    const pageWidth = doc.page.width;
    const pageHeight = doc.page.height;
    const centerX = pageWidth / 2;

    this.setupDocumentLayout(doc, pageWidth, pageHeight);
    this.addLogo(doc, pageWidth);
    this.addHeader(doc, centerX);
    this.addUserInfo(doc, centerX, data);
    this.addScoreInfo(doc, centerX, data);
    this.addDateAndSignature(doc, centerX, data.completedAt, data);
    await this.addQRCode(doc, centerX, data.certificateCode, data);

    return this.generateBuffer(doc);
  }

  private static setupDocumentLayout(doc: any, pageWidth: number, pageHeight: number) {
    PDFLayoutHelper.addBorders(doc, pageWidth, pageHeight);
    PDFLayoutHelper.addBackgroundPattern(doc);
  }

  private static addLogo(doc: any, pageWidth: number) {
    try {
      const logoPath = path.join(__dirname, '../../logo-pdf/nobg_logo.png');
      if (fs.existsSync(logoPath)) {
        doc.image(logoPath, pageWidth - 140, 50, { 
          fit: [70, 40],
          align: 'center',
          valign: 'center'
        });
      }
    } catch (error) {
      // Logo not found, continuing without logo
    }
  }

  private static addHeader(doc: any, centerX: number) {
    const primaryColor = "#467EC7";
    const secondaryColor = "#24CFA7";

    doc.fontSize(36)
       .fillColor(primaryColor)
       .font('Helvetica-Bold')
       .text("CERTIFICATE", centerX - 120, 80, { width: 240, align: "center" });

    doc.fontSize(24)
       .fillColor(secondaryColor)
       .text("OF ACHIEVEMENT", centerX - 120, 120, { width: 240, align: "center" });

    const goldColor = "#FFD700";
    doc.moveTo(centerX - 150, 160)
       .lineTo(centerX + 150, 160)
       .lineWidth(2)
       .stroke(goldColor);
  }

  private static addUserInfo(doc: any, centerX: number, data: any) {
    PDFLayoutHelper.addCertificationText(doc, centerX);
    PDFLayoutHelper.addUserName(doc, centerX, data.userName);
    PDFLayoutHelper.addAssessmentTitle(doc, centerX, data.assessmentTitle);
    
    // Add badge info if badge name exists
    if (data.badgeName) {
      PDFLayoutHelper.addBadgeInfo(doc, centerX, data.badgeName);
    }
  }

  private static addScoreInfo(doc: any, centerX: number, data: any) {
    const primaryColor = "#467EC7";
    const scorePercentage = Math.round(data.score);
    
    // Adjust position based on whether badge info is present
    const scoreY = data.badgeName ? 395 : 390;
    
    doc.fontSize(18)
       .fillColor(primaryColor)
       .font('Helvetica-Bold')
       .text(`Score: ${scorePercentage}/100 (${scorePercentage}%)`, centerX - 200, scoreY, { width: 400, align: "center" });
  }

  private static addDateAndSignature(doc: any, centerX: number, completedAt: Date, data: any) {
    const lightGray = "#718096";
    
    const formattedDate = completedAt.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });

    // Adjust position based on whether badge info is present
    const dateY = data.badgeName ? 425 : 420;

    doc.fontSize(14)
       .fillColor(lightGray)
       .font('Helvetica')
       .text(`Completed on: ${formattedDate}`, centerX - 200, dateY, { width: 400, align: "center" });
  }

  private static async addQRCode(doc: any, centerX: number, certificateCode: string, data: any) {
    const primaryColor = "#467EC7";
    const lightGray = "#718096";
    
    // Adjust position based on whether badge info is present
    const codeY = data.badgeName ? 450 : 445;
    
    doc.fontSize(14)
       .fillColor(lightGray)
       .font('Helvetica')
       .text(`Certificate Code: ${certificateCode}`, centerX - 200, codeY, { width: 400, align: "center" });

    const verificationUrl = `${process.env.FE_URL || 'http://localhost:3000'}/verify-certificate/${certificateCode}`;

    try {
      const qrCodeBuffer = await QRCode.toBuffer(verificationUrl, {
        type: 'png',
        width: 50,
        margin: 1,
        color: {
          dark: '#2D3748',
          light: '#FFFFFF'
        }
      });
      
      const qrX = centerX - 25;
      const qrY = data.badgeName ? 470 : 465;
      doc.image(qrCodeBuffer, qrX, qrY, { width: 50, height: 50 });
      
      doc.fontSize(6)
         .fillColor(primaryColor)
         .font('Helvetica-Bold')
         .text("Scan to Verify", qrX, qrY + 53, { width: 50, align: "center" });
      
      doc.fontSize(5)
         .fillColor(lightGray)
         .font('Helvetica')
         .text(verificationUrl, centerX - 60, qrY + 62, { width: 120, align: "center" });

      // Footer with branding positioned at bottom left
      doc.fontSize(9)
         .fillColor(primaryColor)
         .font('Helvetica-Bold')
         .text("WORKOO JOB BOARD", 50, doc.page.height - 60);

    } catch (error) {
      const qrX = centerX - 25;
      const qrY = data.badgeName ? 470 : 465;
      doc.rect(qrX, qrY, 50, 50)
         .lineWidth(1)
         .stroke(lightGray);
      
      doc.fontSize(6)
         .fillColor(lightGray)
         .text("Verify at:", qrX, qrY + 53, { width: 50, align: "center" });
      
      doc.fontSize(5)
         .text(verificationUrl, centerX - 60, qrY + 62, { width: 120, align: "center" });

      // Footer with branding positioned at bottom left
      doc.fontSize(9)
         .fillColor(primaryColor)
         .font('Helvetica-Bold')
         .text("WORKOO JOB BOARD", 50, doc.page.height - 60);
    }
  }

  private static generateBuffer(doc: any): Promise<Buffer> {
    doc.end();
    const chunks: Buffer[] = [];
    return new Promise((resolve, reject) => {
      doc.on("data", (chunk: Buffer) => chunks.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(chunks)));
      doc.on("error", reject);
    });
  }
}
