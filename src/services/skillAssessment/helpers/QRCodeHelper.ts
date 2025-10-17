import * as QRCode from "qrcode";
import { PDF_COLORS, PDF_FONTS, PDF_LAYOUT } from "../constants/pdfConstants";

export class QRCodeHelper {
  static async generateQRCodeBuffer(url: string): Promise<Buffer> {
    return QRCode.toBuffer(url, {
      type: "png",
      width: PDF_LAYOUT.QR_SIZE,
      margin: PDF_LAYOUT.QR_MARGIN,
      color: {
        dark: PDF_COLORS.DARK_GRAY,
        light: PDF_COLORS.WHITE,
      },
    });
  }

  static getVerificationUrl(certificateCode: string): string {
    const baseUrl = process.env.FE_URL || "http://localhost:3000";
    return `${baseUrl}/verify-certificate/${certificateCode}`;
  }

  static renderQRCode(
    doc: any,
    qrBuffer: Buffer,
    centerX: number,
    qrY: number
  ): void {
    const qrX = centerX - PDF_LAYOUT.QR_SIZE / 2;
    doc.image(qrBuffer, qrX, qrY, {
      width: PDF_LAYOUT.QR_SIZE,
      height: PDF_LAYOUT.QR_SIZE,
    });
  }

  static addQRLink(doc: any, centerX: number, qrY: number, url: string): void {
    const qrX = centerX - PDF_LAYOUT.QR_SIZE / 2;
    doc.link(qrX, qrY, PDF_LAYOUT.QR_SIZE, PDF_LAYOUT.QR_SIZE, url);
  }

  static addScanText(doc: any, centerX: number, qrY: number): void {
    const qrX = centerX - PDF_LAYOUT.QR_SIZE / 2;
    doc
      .fontSize(PDF_FONTS.TINY)
      .fillColor(PDF_COLORS.PRIMARY)
      .font("Helvetica-Bold")
      .text("Scan to Verify", qrX, qrY + 53, {
        width: PDF_LAYOUT.QR_SIZE,
        align: "center",
      });
  }

  static addVerificationUrl(
    doc: any,
    centerX: number,
    qrY: number,
    url: string
  ): void {
    doc
      .fontSize(PDF_FONTS.MICRO)
      .fillColor(PDF_COLORS.LIGHT_GRAY)
      .font("Helvetica")
      .text(url, centerX - 60, qrY + 62, {
        width: PDF_LAYOUT.TEXT_WIDTH_QR,
        align: "center",
      });
    doc.link(centerX - 60, qrY + 62, PDF_LAYOUT.TEXT_WIDTH_QR, 8, url);
  }

  static renderQRCodeFallback(
    doc: any,
    centerX: number,
    qrY: number,
    url: string
  ): void {
    const qrX = centerX - PDF_LAYOUT.QR_SIZE / 2;
    doc
      .rect(qrX, qrY, PDF_LAYOUT.QR_SIZE, PDF_LAYOUT.QR_SIZE)
      .lineWidth(1)
      .stroke(PDF_COLORS.LIGHT_GRAY);

    doc
      .fontSize(PDF_FONTS.TINY)
      .fillColor(PDF_COLORS.LIGHT_GRAY)
      .text("Verify at:", qrX, qrY + 53, {
        width: PDF_LAYOUT.QR_SIZE,
        align: "center",
      });

    this.addVerificationUrl(doc, centerX, qrY, url);
  }

  static addFooter(doc: any): void {
    doc
      .fontSize(PDF_FONTS.SMALL)
      .fillColor(PDF_COLORS.PRIMARY)
      .font("Helvetica-Bold")
      .text(
        "WORKOO JOB BOARD",
        50,
        doc.page.height - PDF_LAYOUT.FOOTER_Y_OFFSET
      );
  }

  static generateBuffer(doc: any): Promise<Buffer> {
    doc.end();
    const chunks: Buffer[] = [];
    return new Promise((resolve, reject) => {
      doc.on("data", (chunk: Buffer) => chunks.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(chunks)));
      doc.on("error", reject);
    });
  }
}
