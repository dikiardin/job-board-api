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
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const QRCode = __importStar(require("qrcode"));
const PDFLayoutHelper_1 = require("./helpers/PDFLayoutHelper");
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
        this.addLogo(doc, pageWidth);
        this.addHeader(doc, centerX);
        this.addUserInfo(doc, centerX, data);
        this.addScoreInfo(doc, centerX, data);
        this.addDateAndSignature(doc, centerX, data.completedAt, data);
        await this.addQRCode(doc, centerX, data.certificateCode, data);
        return this.generateBuffer(doc);
    }
    static setupDocumentLayout(doc, pageWidth, pageHeight) {
        PDFLayoutHelper_1.PDFLayoutHelper.addBorders(doc, pageWidth, pageHeight);
        PDFLayoutHelper_1.PDFLayoutHelper.addBackgroundPattern(doc);
    }
    static addLogo(doc, pageWidth) {
        try {
            const logoPath = path.join(__dirname, "../../logo-pdf/nobg_logo.png");
            if (fs.existsSync(logoPath)) {
                doc.image(logoPath, pageWidth - 140, 50, {
                    fit: [70, 40],
                    align: "center",
                    valign: "center",
                });
            }
        }
        catch (error) {
            // Logo not found, continuing without logo
        }
    }
    static addHeader(doc, centerX) {
        const primaryColor = "#467EC7";
        const secondaryColor = "#24CFA7";
        doc
            .fontSize(36)
            .fillColor(primaryColor)
            .font("Helvetica-Bold")
            .text("CERTIFICATE", centerX - 120, 80, { width: 240, align: "center" });
        doc
            .fontSize(24)
            .fillColor(secondaryColor)
            .text("OF ACHIEVEMENT", centerX - 120, 120, {
            width: 240,
            align: "center",
        });
        const goldColor = "#FFD700";
        doc
            .moveTo(centerX - 150, 160)
            .lineTo(centerX + 150, 160)
            .lineWidth(2)
            .stroke(goldColor);
    }
    static addUserInfo(doc, centerX, data) {
        PDFLayoutHelper_1.PDFLayoutHelper.addCertificationText(doc, centerX);
        PDFLayoutHelper_1.PDFLayoutHelper.addUserName(doc, centerX, data.userName);
        PDFLayoutHelper_1.PDFLayoutHelper.addAssessmentTitle(doc, centerX, data.assessmentTitle);
        // Add badge info if badge name exists
        if (data.badgeName) {
            PDFLayoutHelper_1.PDFLayoutHelper.addBadgeInfo(doc, centerX, data.badgeName);
        }
    }
    static addScoreInfo(doc, centerX, data) {
        const primaryColor = "#467EC7";
        const scorePercentage = Math.round(data.score);
        // Adjust position based on whether badge info is present
        const scoreY = data.badgeName ? 395 : 390;
        doc
            .fontSize(18)
            .fillColor(primaryColor)
            .font("Helvetica-Bold")
            .text(`Score: ${scorePercentage}/100 (${scorePercentage}%)`, centerX - 200, scoreY, { width: 400, align: "center" });
    }
    static addDateAndSignature(doc, centerX, completedAt, data) {
        const lightGray = "#718096";
        const formattedDate = completedAt.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
        // Adjust position based on whether badge info is present
        const dateY = data.badgeName ? 425 : 420;
        doc
            .fontSize(14)
            .fillColor(lightGray)
            .font("Helvetica")
            .text(`Completed on: ${formattedDate}`, centerX - 200, dateY, {
            width: 400,
            align: "center",
        });
    }
    static async addQRCode(doc, centerX, certificateCode, data) {
        const primaryColor = "#467EC7";
        const lightGray = "#718096";
        // Adjust position based on whether badge info is present
        const codeY = data.badgeName ? 450 : 445;
        doc
            .fontSize(14)
            .fillColor(lightGray)
            .font("Helvetica")
            .text(`Certificate Code: ${certificateCode}`, centerX - 200, codeY, {
            width: 400,
            align: "center",
        });
        const verificationUrl = `${process.env.FE_URL || "http://localhost:3000"}/verify-certificate/${certificateCode}`;
        try {
            const qrCodeBuffer = await QRCode.toBuffer(verificationUrl, {
                type: "png",
                width: 50,
                margin: 1,
                color: {
                    dark: "#2D3748",
                    light: "#FFFFFF",
                },
            });
            const qrX = centerX - 25;
            const qrY = data.badgeName ? 470 : 465;
            doc.image(qrCodeBuffer, qrX, qrY, { width: 50, height: 50 });
            // Make QR area clickable
            doc.link(qrX, qrY, 50, 50, verificationUrl);
            doc
                .fontSize(6)
                .fillColor(primaryColor)
                .font("Helvetica-Bold")
                .text("Scan to Verify", qrX, qrY + 53, { width: 50, align: "center" });
            doc
                .fontSize(5)
                .fillColor(lightGray)
                .font("Helvetica")
                .text(verificationUrl, centerX - 60, qrY + 62, {
                width: 120,
                align: "center",
            });
            // Add clickable link over the URL text area
            doc.link(centerX - 60, qrY + 62, 120, 8, verificationUrl);
            // Footer with branding positioned at bottom left
            doc
                .fontSize(9)
                .fillColor(primaryColor)
                .font("Helvetica-Bold")
                .text("WORKOO JOB BOARD", 50, doc.page.height - 60);
        }
        catch (error) {
            const qrX = centerX - 25;
            const qrY = data.badgeName ? 470 : 465;
            doc.rect(qrX, qrY, 50, 50).lineWidth(1).stroke(lightGray);
            doc
                .fontSize(6)
                .fillColor(lightGray)
                .text("Verify at:", qrX, qrY + 53, { width: 50, align: "center" });
            doc
                .fontSize(5)
                .text(verificationUrl, centerX - 60, qrY + 62, {
                width: 120,
                align: "center",
            });
            doc.link(centerX - 60, qrY + 62, 120, 8, verificationUrl);
            // Footer with branding positioned at bottom left
            doc
                .fontSize(9)
                .fillColor(primaryColor)
                .font("Helvetica-Bold")
                .text("WORKOO JOB BOARD", 50, doc.page.height - 60);
        }
    }
    static generateBuffer(doc) {
        doc.end();
        const chunks = [];
        return new Promise((resolve, reject) => {
            doc.on("data", (chunk) => chunks.push(chunk));
            doc.on("end", () => resolve(Buffer.concat(chunks)));
            doc.on("error", reject);
        });
    }
}
exports.PDFLayoutService = PDFLayoutService;
