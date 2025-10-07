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
class PDFLayoutService {
    static async generateCertificatePDF(data) {
        // Create PDF document with landscape orientation for better certificate layout
        const doc = new PDFKit.default({
            size: "A4",
            layout: "landscape",
            margin: 40,
        });
        const pageWidth = doc.page.width;
        const pageHeight = doc.page.height;
        const centerX = pageWidth / 2;
        // Define colors
        const primaryColor = "#467EC7";
        const secondaryColor = "#24CFA7";
        const goldColor = "#FFD700";
        const darkGray = "#2D3748";
        const lightGray = "#718096";
        // Add decorative border
        doc.rect(20, 20, pageWidth - 40, pageHeight - 40)
            .lineWidth(3)
            .stroke(primaryColor);
        doc.rect(30, 30, pageWidth - 60, pageHeight - 60)
            .lineWidth(1)
            .stroke(goldColor);
        // Add background pattern (subtle)
        for (let i = 0; i < 15; i++) {
            for (let j = 0; j < 10; j++) {
                doc.circle(60 + i * 50, 60 + j * 50, 1)
                    .fillOpacity(0.05)
                    .fill(primaryColor);
            }
        }
        // Reset opacity
        doc.fillOpacity(1);
        // Add Workoo logo in top right corner (maintain aspect ratio, away from border)
        try {
            const logoPath = path.join(__dirname, '../../logo-pdf/nobg_logo.png');
            if (fs.existsSync(logoPath)) {
                // Use fit option to maintain aspect ratio, positioned away from border
                doc.image(logoPath, pageWidth - 140, 50, {
                    fit: [70, 40],
                    align: 'center',
                    valign: 'center'
                });
            }
        }
        catch (error) {
            console.log('Logo not found, continuing without logo');
        }
        // Header with logo area
        doc.fontSize(36)
            .fillColor(primaryColor)
            .font('Helvetica-Bold')
            .text("CERTIFICATE", centerX - 120, 80, { width: 240, align: "center" });
        doc.fontSize(24)
            .fillColor(secondaryColor)
            .text("OF ACHIEVEMENT", centerX - 120, 120, { width: 240, align: "center" });
        // Decorative line under header
        doc.moveTo(centerX - 150, 160)
            .lineTo(centerX + 150, 160)
            .lineWidth(2)
            .stroke(goldColor);
        // Main content
        doc.fontSize(16)
            .fillColor(darkGray)
            .font('Helvetica')
            .text("This is to certify that", centerX - 200, 200, { width: 400, align: "center" });
        // User name with decorative styling
        doc.fontSize(32)
            .fillColor(primaryColor)
            .font('Helvetica-Bold')
            .text(data.userName, centerX - 250, 240, { width: 500, align: "center" });
        // Underline for name
        doc.fontSize(32); // Set font size first
        const nameWidth = doc.widthOfString(data.userName);
        doc.moveTo(centerX - nameWidth / 2, 280)
            .lineTo(centerX + nameWidth / 2, 280)
            .lineWidth(2)
            .stroke(goldColor);
        // Achievement text
        doc.fontSize(16)
            .fillColor(darkGray)
            .font('Helvetica')
            .text("has successfully completed the", centerX - 200, 310, { width: 400, align: "center" });
        // Assessment title
        doc.fontSize(24)
            .fillColor(secondaryColor)
            .font('Helvetica-Bold')
            .text(data.assessmentTitle, centerX - 250, 340, { width: 500, align: "center" });
        // Score and details section (using real data)
        const scorePercentage = Math.round(data.score);
        doc.fontSize(18)
            .fillColor(primaryColor)
            .font('Helvetica-Bold')
            .text(`Score: ${data.score}/${data.totalQuestions} (${scorePercentage}%)`, centerX - 200, 390, { width: 400, align: "center" });
        // Date and certificate info
        const formattedDate = data.completedAt.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        doc.fontSize(14)
            .fillColor(lightGray)
            .font('Helvetica')
            .text(`Completed on: ${formattedDate}`, centerX - 200, 430, { width: 400, align: "center" });
        doc.text(`Certificate Code: ${data.certificateCode}`, centerX - 200, 450, { width: 400, align: "center" });
        // QR Code for certificate verification (very compact layout)
        // Generate QR code for certificate verification
        const verificationUrl = `${process.env.FE_URL || 'http://localhost:3000'}/verify-certificate/${data.certificateCode}`;
        try {
            // Generate QR code as buffer
            const qrCodeBuffer = await QRCode.toBuffer(verificationUrl, {
                type: 'png',
                width: 50,
                margin: 1,
                color: {
                    dark: '#2D3748', // Dark gray
                    light: '#FFFFFF' // White background
                }
            });
            // Add QR code image to PDF (very compact positioning)
            const qrX = centerX - 25; // Center the 50px QR code
            const qrY = 465; // Very close to certificate code
            doc.image(qrCodeBuffer, qrX, qrY, { width: 50, height: 50 });
            // Very compact text layout
            doc.fontSize(6)
                .fillColor(primaryColor)
                .font('Helvetica-Bold')
                .text("Scan to Verify", qrX, qrY + 53, { width: 50, align: "center" });
            doc.fontSize(5)
                .fillColor(lightGray)
                .font('Helvetica')
                .text(verificationUrl, centerX - 60, qrY + 62, { width: 120, align: "center" });
            // Footer with branding (positioned right after QR code)
            doc.fontSize(9)
                .fillColor(primaryColor)
                .font('Helvetica-Bold')
                .text("WORKOO JOB BOARD", 50, qrY + 75);
        }
        catch (error) {
            console.log('QR code generation failed, using placeholder:', error);
            // Fallback to simple verification box
            const qrX = centerX - 25;
            const qrY = 465;
            doc.rect(qrX, qrY, 50, 50)
                .lineWidth(1)
                .stroke(lightGray);
            doc.fontSize(6)
                .fillColor(lightGray)
                .text("Verify at:", qrX, qrY + 53, { width: 50, align: "center" });
            doc.fontSize(5)
                .text(verificationUrl, centerX - 60, qrY + 62, { width: 120, align: "center" });
            // Footer with branding (positioned right after QR code)
            doc.fontSize(9)
                .fillColor(primaryColor)
                .font('Helvetica-Bold')
                .text("WORKOO JOB BOARD", 50, qrY + 75);
        }
        // Finalize PDF
        doc.end();
        // Convert to buffer
        const chunks = [];
        return new Promise((resolve, reject) => {
            doc.on("data", (chunk) => chunks.push(chunk));
            doc.on("end", () => resolve(Buffer.concat(chunks)));
            doc.on("error", reject);
        });
    }
}
exports.PDFLayoutService = PDFLayoutService;
//# sourceMappingURL=pdfLayout.service.js.map