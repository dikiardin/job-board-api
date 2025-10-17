"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.PDFLayoutService = void 0;
const PDFKit = __importStar(require("pdfkit"));
const PDFLayoutHelper_1 = require("./helpers/PDFLayoutHelper");
const QRCodeHelper_1 = require("./helpers/QRCodeHelper");
const PositionCalculator_1 = require("./helpers/PositionCalculator");
const LogoHelper_1 = require("./helpers/LogoHelper");
const pdfConstants_1 = require("./constants/pdfConstants");
class PDFLayoutService {
    static async generateCertificatePDF(data) {
        const doc = new PDFKit.default({
            size: "A4",
            layout: "landscape",
            margin: 40,
        });
        const pageWidth = doc.page.width;
        const pageHeight = doc.page.height;
        const centerX = pageWidth / 2;
        this.setupDocumentLayout(doc, pageWidth, pageHeight);
        LogoHelper_1.LogoHelper.addLogo(doc, pageWidth);
        this.addHeader(doc, centerX);
        this.addUserInfo(doc, centerX, data);
        this.addScoreInfo(doc, centerX, data);
        this.addDateAndSignature(doc, centerX, data.completedAt, data);
        await this.addQRCode(doc, centerX, data.certificateCode, data);
        return QRCodeHelper_1.QRCodeHelper.generateBuffer(doc);
    }
    static setupDocumentLayout(doc, pageWidth, pageHeight) {
        PDFLayoutHelper_1.PDFLayoutHelper.addBorders(doc, pageWidth, pageHeight);
        PDFLayoutHelper_1.PDFLayoutHelper.addBackgroundPattern(doc);
    }
    static addHeader(doc, centerX) {
        this.addCertificateTitle(doc, centerX);
        this.addSubtitle(doc, centerX);
        this.addDividerLine(doc, centerX);
    }
    static addCertificateTitle(doc, centerX) {
        doc
            .fontSize(pdfConstants_1.PDF_FONTS.TITLE)
            .fillColor(pdfConstants_1.PDF_COLORS.PRIMARY)
            .font("Helvetica-Bold")
            .text("CERTIFICATE", centerX - 120, pdfConstants_1.PDF_LAYOUT.HEADER_Y, {
            width: pdfConstants_1.PDF_LAYOUT.TEXT_WIDTH_NARROW,
            align: "center",
        });
    }
    static addSubtitle(doc, centerX) {
        doc
            .fontSize(pdfConstants_1.PDF_FONTS.SUBTITLE)
            .fillColor(pdfConstants_1.PDF_COLORS.SECONDARY)
            .text("OF ACHIEVEMENT", centerX - 120, pdfConstants_1.PDF_LAYOUT.SUBTITLE_Y, {
            width: pdfConstants_1.PDF_LAYOUT.TEXT_WIDTH_NARROW,
            align: "center",
        });
    }
    static addDividerLine(doc, centerX) {
        const halfWidth = pdfConstants_1.PDF_LAYOUT.DIVIDER_WIDTH / 2;
        doc
            .moveTo(centerX - halfWidth, pdfConstants_1.PDF_LAYOUT.DIVIDER_Y)
            .lineTo(centerX + halfWidth, pdfConstants_1.PDF_LAYOUT.DIVIDER_Y)
            .lineWidth(pdfConstants_1.PDF_LAYOUT.BORDER_WIDTH)
            .stroke(pdfConstants_1.PDF_COLORS.GOLD);
    }
    static addUserInfo(doc, centerX, data) {
        PDFLayoutHelper_1.PDFLayoutHelper.addCertificationText(doc, centerX);
        PDFLayoutHelper_1.PDFLayoutHelper.addUserName(doc, centerX, data.userName);
        PDFLayoutHelper_1.PDFLayoutHelper.addAssessmentTitle(doc, centerX, data.assessmentTitle);
        if (data.badgeName) {
            PDFLayoutHelper_1.PDFLayoutHelper.addBadgeInfo(doc, centerX, data.badgeName);
        }
    }
    static addScoreInfo(doc, centerX, data) {
        const scorePercentage = Math.round(data.score);
        const scoreY = PositionCalculator_1.PositionCalculator.getScoreY(!!data.badgeName);
        doc
            .fontSize(pdfConstants_1.PDF_FONTS.LARGE)
            .fillColor(pdfConstants_1.PDF_COLORS.PRIMARY)
            .font("Helvetica-Bold")
            .text(`Score: ${scorePercentage}/100 (${scorePercentage}%)`, centerX - 200, scoreY, { width: pdfConstants_1.PDF_LAYOUT.TEXT_WIDTH_STANDARD, align: "center" });
    }
    static addDateAndSignature(doc, centerX, completedAt, data) {
        const formattedDate = completedAt.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
        const dateY = PositionCalculator_1.PositionCalculator.getDateY(!!data.badgeName);
        doc
            .fontSize(pdfConstants_1.PDF_FONTS.MEDIUM)
            .fillColor(pdfConstants_1.PDF_COLORS.LIGHT_GRAY)
            .font("Helvetica")
            .text(`Completed on: ${formattedDate}`, centerX - 200, dateY, {
            width: pdfConstants_1.PDF_LAYOUT.TEXT_WIDTH_STANDARD,
            align: "center",
        });
    }
    static async addQRCode(doc, centerX, certificateCode, data) {
        this.addCertificateCode(doc, centerX, certificateCode, data);
        const verificationUrl = QRCodeHelper_1.QRCodeHelper.getVerificationUrl(certificateCode);
        await this.renderQRCodeSection(doc, centerX, verificationUrl, data);
        QRCodeHelper_1.QRCodeHelper.addFooter(doc);
    }
    static addCertificateCode(doc, centerX, certificateCode, data) {
        const codeY = PositionCalculator_1.PositionCalculator.getCodeY(!!data.badgeName);
        doc
            .fontSize(pdfConstants_1.PDF_FONTS.MEDIUM)
            .fillColor(pdfConstants_1.PDF_COLORS.LIGHT_GRAY)
            .font("Helvetica")
            .text(`Certificate Code: ${certificateCode}`, centerX - 200, codeY, {
            width: pdfConstants_1.PDF_LAYOUT.TEXT_WIDTH_STANDARD,
            align: "center",
        });
    }
    static async renderQRCodeSection(doc, centerX, verificationUrl, data) {
        const qrY = PositionCalculator_1.PositionCalculator.getQRY(!!data.badgeName);
        try {
            const qrCodeBuffer = await QRCodeHelper_1.QRCodeHelper.generateQRCodeBuffer(verificationUrl);
            QRCodeHelper_1.QRCodeHelper.renderQRCode(doc, qrCodeBuffer, centerX, qrY);
            QRCodeHelper_1.QRCodeHelper.addQRLink(doc, centerX, qrY, verificationUrl);
            QRCodeHelper_1.QRCodeHelper.addScanText(doc, centerX, qrY);
            QRCodeHelper_1.QRCodeHelper.addVerificationUrl(doc, centerX, qrY, verificationUrl);
        }
        catch (error) {
            QRCodeHelper_1.QRCodeHelper.renderQRCodeFallback(doc, centerX, qrY, verificationUrl);
        }
    }
}
exports.PDFLayoutService = PDFLayoutService;
