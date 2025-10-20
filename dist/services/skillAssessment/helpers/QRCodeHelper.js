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
exports.QRCodeHelper = void 0;
const QRCode = __importStar(require("qrcode"));
const pdfConstants_1 = require("../constants/pdfConstants");
class QRCodeHelper {
    static async generateQRCodeBuffer(url) {
        return QRCode.toBuffer(url, {
            type: "png",
            width: pdfConstants_1.PDF_LAYOUT.QR_SIZE,
            margin: pdfConstants_1.PDF_LAYOUT.QR_MARGIN,
            color: {
                dark: pdfConstants_1.PDF_COLORS.DARK_GRAY,
                light: pdfConstants_1.PDF_COLORS.WHITE,
            },
        });
    }
    static getVerificationUrl(certificateCode) {
        const baseUrl = process.env.FE_URL || "http://localhost:3000";
        return `${baseUrl}/verify-certificate/${certificateCode}`;
    }
    static renderQRCode(doc, qrBuffer, centerX, qrY) {
        const qrX = centerX - pdfConstants_1.PDF_LAYOUT.QR_SIZE / 2;
        doc.image(qrBuffer, qrX, qrY, {
            width: pdfConstants_1.PDF_LAYOUT.QR_SIZE,
            height: pdfConstants_1.PDF_LAYOUT.QR_SIZE,
        });
    }
    static addQRLink(doc, centerX, qrY, url) {
        const qrX = centerX - pdfConstants_1.PDF_LAYOUT.QR_SIZE / 2;
        doc.link(qrX, qrY, pdfConstants_1.PDF_LAYOUT.QR_SIZE, pdfConstants_1.PDF_LAYOUT.QR_SIZE, url);
    }
    static addScanText(doc, centerX, qrY) {
        const qrX = centerX - pdfConstants_1.PDF_LAYOUT.QR_SIZE / 2;
        doc
            .fontSize(pdfConstants_1.PDF_FONTS.TINY)
            .fillColor(pdfConstants_1.PDF_COLORS.PRIMARY)
            .font("Helvetica-Bold")
            .text("Scan to Verify", qrX, qrY + 53, {
            width: pdfConstants_1.PDF_LAYOUT.QR_SIZE,
            align: "center",
        });
    }
    static addVerificationUrl(doc, centerX, qrY, url) {
        doc
            .fontSize(pdfConstants_1.PDF_FONTS.MICRO)
            .fillColor(pdfConstants_1.PDF_COLORS.LIGHT_GRAY)
            .font("Helvetica")
            .text(url, centerX - 60, qrY + 62, {
            width: pdfConstants_1.PDF_LAYOUT.TEXT_WIDTH_QR,
            align: "center",
        });
        doc.link(centerX - 60, qrY + 62, pdfConstants_1.PDF_LAYOUT.TEXT_WIDTH_QR, 8, url);
    }
    static renderQRCodeFallback(doc, centerX, qrY, url) {
        const qrX = centerX - pdfConstants_1.PDF_LAYOUT.QR_SIZE / 2;
        doc
            .rect(qrX, qrY, pdfConstants_1.PDF_LAYOUT.QR_SIZE, pdfConstants_1.PDF_LAYOUT.QR_SIZE)
            .lineWidth(1)
            .stroke(pdfConstants_1.PDF_COLORS.LIGHT_GRAY);
        doc
            .fontSize(pdfConstants_1.PDF_FONTS.TINY)
            .fillColor(pdfConstants_1.PDF_COLORS.LIGHT_GRAY)
            .text("Verify at:", qrX, qrY + 53, {
            width: pdfConstants_1.PDF_LAYOUT.QR_SIZE,
            align: "center",
        });
        this.addVerificationUrl(doc, centerX, qrY, url);
    }
    static addFooter(doc) {
        doc
            .fontSize(pdfConstants_1.PDF_FONTS.SMALL)
            .fillColor(pdfConstants_1.PDF_COLORS.PRIMARY)
            .font("Helvetica-Bold")
            .text("WORKOO JOB BOARD", 50, doc.page.height - pdfConstants_1.PDF_LAYOUT.FOOTER_Y_OFFSET);
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
exports.QRCodeHelper = QRCodeHelper;
