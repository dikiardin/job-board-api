"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QRCodeGenerationService = void 0;
const qrcode_1 = __importDefault(require("qrcode"));
class QRCodeGenerationService {
    // Generate QR code buffer
    static async generateQRCodeBuffer(verificationUrl, size = 55) {
        try {
            const qrCodeBuffer = await qrcode_1.default.toBuffer(verificationUrl, {
                type: "png",
                width: size,
                margin: 1,
                color: {
                    dark: "#1f2937", // Dark color for QR code
                    light: "#ffffff", // Light/background color
                },
                errorCorrectionLevel: "M",
            });
            return qrCodeBuffer;
        }
        catch (error) {
            console.error("QR Code generation failed:", error);
            return null;
        }
    }
    // Add QR code to PDF document
    static async addQRCodeToPDF(doc, certificateCode, qrY) {
        const qrSize = 55;
        const qrX = (842 - qrSize) / 2; // Center for full page width
        // Generate verification URL for QR code
        const baseUrl = process.env.FRONTEND_URL || "http://localhost:3000";
        const verificationUrl = `${baseUrl}/verify-certificate/${certificateCode}`;
        console.log("Generated QR URL:", verificationUrl); // Debug log
        // Generate QR code as buffer
        const qrCodeBuffer = await this.generateQRCodeBuffer(verificationUrl, qrSize);
        // QR Code border with better styling
        doc
            .rect(qrX - 3, qrY - 3, qrSize + 6, qrSize + 6)
            .strokeColor("#2563eb")
            .lineWidth(1.5)
            .stroke();
        // Insert the actual QR code image or fallback pattern
        if (qrCodeBuffer && qrCodeBuffer.length > 0) {
            doc.image(qrCodeBuffer, qrX, qrY, { width: qrSize, height: qrSize });
        }
        else {
            this.drawFallbackQRPattern(doc, qrX, qrY, qrSize);
        }
        // QR Code label
        doc
            .fontSize(8)
            .font("Helvetica-Bold")
            .fillColor("#6b7280")
            .text("SCAN TO VERIFY", 60, qrY + qrSize + 8, {
            align: "center",
            width: 722,
        });
        // Verification URL (better formatted)
        doc
            .fontSize(7)
            .fillColor("#6b7280")
            .text(`Verify: ${verificationUrl}`, 60, qrY + qrSize + 22, {
            align: "center",
            width: 722,
        });
    }
    // Draw fallback QR-like pattern if QR generation fails
    static drawFallbackQRPattern(doc, qrX, qrY, qrSize) {
        // Fallback: draw a simple QR-like pattern
        doc
            .rect(qrX, qrY, qrSize, qrSize)
            .fillColor("#f9fafb")
            .fill()
            .strokeColor("#d1d5db")
            .lineWidth(0.5)
            .stroke();
        // Add simple pattern
        const cellSize = 3;
        const cells = Math.floor(qrSize / cellSize);
        for (let i = 0; i < cells; i++) {
            for (let j = 0; j < cells; j++) {
                if ((i + j) % 3 === 0 ||
                    (i % 4 === 0 && j % 4 === 0) ||
                    (i < 3 && j < 3) ||
                    (i > cells - 4 && j < 3) ||
                    (i < 3 && j > cells - 4)) {
                    doc
                        .rect(qrX + i * cellSize, qrY + j * cellSize, cellSize, cellSize)
                        .fillColor("#1f2937")
                        .fill();
                }
            }
        }
    }
    // Generate verification URL
    static generateVerificationUrl(certificateCode) {
        const baseUrl = process.env.FRONTEND_URL || "http://localhost:3000";
        return `${baseUrl}/verify-certificate/${certificateCode}`;
    }
    // Validate QR code data
    static validateQRData(data) {
        try {
            // Check if it's a valid URL
            new URL(data);
            // Check if it contains certificate verification pattern
            return data.includes("/verify-certificate/");
        }
        catch {
            return false;
        }
    }
    // Get QR code info
    static getQRCodeInfo(certificateCode) {
        const verificationUrl = this.generateVerificationUrl(certificateCode);
        return {
            url: verificationUrl,
            size: 55,
            format: "PNG",
            errorCorrection: "M",
            margin: 1,
            colors: {
                dark: "#1f2937",
                light: "#ffffff",
            },
        };
    }
    // Test QR code generation
    static async testQRGeneration(testUrl = "https://example.com") {
        try {
            const buffer = await this.generateQRCodeBuffer(testUrl, 50);
            return buffer !== null && buffer.length > 0;
        }
        catch {
            return false;
        }
    }
}
exports.QRCodeGenerationService = QRCodeGenerationService;
//# sourceMappingURL=qrCodeGeneration.service.js.map