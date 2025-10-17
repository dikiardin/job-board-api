import * as PDFKit from "pdfkit";
import { PDFLayoutHelper } from "./helpers/PDFLayoutHelper";
import { QRCodeHelper } from "./helpers/QRCodeHelper";
import { PositionCalculator } from "./helpers/PositionCalculator";
import { LogoHelper } from "./helpers/LogoHelper";
import { CertificateData } from "./types/CertificateData";
import { PDF_COLORS, PDF_FONTS, PDF_LAYOUT } from "./constants/pdfConstants";

export class PDFLayoutService {
  public static async generateCertificatePDF(
    data: CertificateData
  ): Promise<Buffer> {
    const doc = new PDFKit.default({
      size: "A4",
      layout: "landscape",
      margin: 40,
    });

    const pageWidth = doc.page.width;
    const pageHeight = doc.page.height;
    const centerX = pageWidth / 2;

    this.setupDocumentLayout(doc, pageWidth, pageHeight);
    LogoHelper.addLogo(doc, pageWidth);
    this.addHeader(doc, centerX);
    this.addUserInfo(doc, centerX, data);
    this.addScoreInfo(doc, centerX, data);
    this.addDateAndSignature(doc, centerX, data.completedAt, data);
    await this.addQRCode(doc, centerX, data.certificateCode, data);

    return QRCodeHelper.generateBuffer(doc);
  }

  private static setupDocumentLayout(
    doc: any,
    pageWidth: number,
    pageHeight: number
  ) {
    PDFLayoutHelper.addBorders(doc, pageWidth, pageHeight);
    PDFLayoutHelper.addBackgroundPattern(doc);
  }

  private static addHeader(doc: any, centerX: number) {
    this.addCertificateTitle(doc, centerX);
    this.addSubtitle(doc, centerX);
    this.addDividerLine(doc, centerX);
  }

  private static addCertificateTitle(doc: any, centerX: number) {
    doc
      .fontSize(PDF_FONTS.TITLE)
      .fillColor(PDF_COLORS.PRIMARY)
      .font("Helvetica-Bold")
      .text("CERTIFICATE", centerX - 120, PDF_LAYOUT.HEADER_Y, {
        width: PDF_LAYOUT.TEXT_WIDTH_NARROW,
        align: "center",
      });
  }

  private static addSubtitle(doc: any, centerX: number) {
    doc
      .fontSize(PDF_FONTS.SUBTITLE)
      .fillColor(PDF_COLORS.SECONDARY)
      .text("OF ACHIEVEMENT", centerX - 120, PDF_LAYOUT.SUBTITLE_Y, {
        width: PDF_LAYOUT.TEXT_WIDTH_NARROW,
        align: "center",
      });
  }

  private static addDividerLine(doc: any, centerX: number) {
    const halfWidth = PDF_LAYOUT.DIVIDER_WIDTH / 2;
    doc
      .moveTo(centerX - halfWidth, PDF_LAYOUT.DIVIDER_Y)
      .lineTo(centerX + halfWidth, PDF_LAYOUT.DIVIDER_Y)
      .lineWidth(PDF_LAYOUT.BORDER_WIDTH)
      .stroke(PDF_COLORS.GOLD);
  }

  private static addUserInfo(doc: any, centerX: number, data: CertificateData) {
    PDFLayoutHelper.addCertificationText(doc, centerX);
    PDFLayoutHelper.addUserName(doc, centerX, data.userName);
    PDFLayoutHelper.addAssessmentTitle(doc, centerX, data.assessmentTitle);

    if (data.badgeName) {
      PDFLayoutHelper.addBadgeInfo(doc, centerX, data.badgeName);
    }
  }

  private static addScoreInfo(
    doc: any,
    centerX: number,
    data: CertificateData
  ) {
    const scorePercentage = Math.round(data.score);
    const scoreY = PositionCalculator.getScoreY(!!data.badgeName);

    doc
      .fontSize(PDF_FONTS.LARGE)
      .fillColor(PDF_COLORS.PRIMARY)
      .font("Helvetica-Bold")
      .text(
        `Score: ${scorePercentage}/100 (${scorePercentage}%)`,
        centerX - 200,
        scoreY,
        { width: PDF_LAYOUT.TEXT_WIDTH_STANDARD, align: "center" }
      );
  }

  private static addDateAndSignature(
    doc: any,
    centerX: number,
    completedAt: Date,
    data: CertificateData
  ) {
    const formattedDate = completedAt.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const dateY = PositionCalculator.getDateY(!!data.badgeName);

    doc
      .fontSize(PDF_FONTS.MEDIUM)
      .fillColor(PDF_COLORS.LIGHT_GRAY)
      .font("Helvetica")
      .text(`Completed on: ${formattedDate}`, centerX - 200, dateY, {
        width: PDF_LAYOUT.TEXT_WIDTH_STANDARD,
        align: "center",
      });
  }

  private static async addQRCode(
    doc: any,
    centerX: number,
    certificateCode: string,
    data: CertificateData
  ) {
    this.addCertificateCode(doc, centerX, certificateCode, data);
    const verificationUrl = QRCodeHelper.getVerificationUrl(certificateCode);
    await this.renderQRCodeSection(doc, centerX, verificationUrl, data);
    QRCodeHelper.addFooter(doc);
  }

  private static addCertificateCode(
    doc: any,
    centerX: number,
    certificateCode: string,
    data: CertificateData
  ) {
    const codeY = PositionCalculator.getCodeY(!!data.badgeName);

    doc
      .fontSize(PDF_FONTS.MEDIUM)
      .fillColor(PDF_COLORS.LIGHT_GRAY)
      .font("Helvetica")
      .text(`Certificate Code: ${certificateCode}`, centerX - 200, codeY, {
        width: PDF_LAYOUT.TEXT_WIDTH_STANDARD,
        align: "center",
      });
  }

  private static async renderQRCodeSection(
    doc: any,
    centerX: number,
    verificationUrl: string,
    data: CertificateData
  ) {
    const qrY = PositionCalculator.getQRY(!!data.badgeName);

    try {
      const qrCodeBuffer = await QRCodeHelper.generateQRCodeBuffer(
        verificationUrl
      );
      QRCodeHelper.renderQRCode(doc, qrCodeBuffer, centerX, qrY);
      QRCodeHelper.addQRLink(doc, centerX, qrY, verificationUrl);
      QRCodeHelper.addScanText(doc, centerX, qrY);
      QRCodeHelper.addVerificationUrl(doc, centerX, qrY, verificationUrl);
    } catch (error) {
      QRCodeHelper.renderQRCodeFallback(doc, centerX, qrY, verificationUrl);
    }
  }
}
