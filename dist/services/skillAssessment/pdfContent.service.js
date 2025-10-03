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
exports.PDFContentService = void 0;
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
class PDFContentService {
    // Add header section
    static async addHeader(doc, badgeIcon) {
        // Background border
        doc.rect(20, 20, 802, 515).strokeColor("#2563eb").lineWidth(3).stroke();
        doc.rect(30, 30, 782, 495).strokeColor("#e5e7eb").lineWidth(1).stroke();
        // Add website logo (left top corner)
        await this.addWebsiteLogo(doc);
        // Add badge logo (right top corner) if provided
        if (badgeIcon) {
            await this.addBadgeLogo(doc, badgeIcon);
        }
        // Company name
        doc
            .fontSize(18)
            .font("Helvetica-Bold")
            .fillColor("#1f2937")
            .text("WORKOO JOB BOARD", 60, 70, { align: "center", width: 722 });
        // Main title
        doc
            .fontSize(28)
            .font("Helvetica-Bold")
            .fillColor("#2563eb")
            .text("CERTIFICATE OF ACHIEVEMENT", 60, 100, {
            align: "center",
            width: 722,
        });
        // Decorative line
        doc
            .moveTo(250, 135)
            .lineTo(592, 135)
            .strokeColor("#24CFA7")
            .lineWidth(3)
            .stroke();
    }
    // Add certificate body content
    static addCertificateBody(doc, data) {
        // Certificate body text
        doc
            .fontSize(14)
            .fillColor("#374151")
            .font("Helvetica")
            .text("This is to certify that", 60, 155, {
            align: "center",
            width: 722,
        });
        // User name
        doc
            .fontSize(26)
            .font("Helvetica-Bold")
            .fillColor("#1f2937")
            .text(data.userName, 60, 180, { align: "center", width: 722 });
        // User email
        doc
            .fontSize(10)
            .font("Helvetica")
            .fillColor("#6b7280")
            .text(`${data.userEmail}`, 60, 210, { align: "center", width: 722 });
        // Completion text
        doc
            .fontSize(14)
            .font("Helvetica")
            .fillColor("#374151")
            .text("has successfully completed the skill assessment", 60, 235, {
            align: "center",
            width: 722,
        });
        // Assessment title
        doc
            .fontSize(20)
            .font("Helvetica-Bold")
            .fillColor("#2563eb")
            .text(data.assessmentTitle, 60, 260, { align: "center", width: 722 });
        // Assessment description (if available)
        if (data.assessmentDescription) {
            doc
                .fontSize(10)
                .font("Helvetica")
                .fillColor("#6b7280")
                .text(data.assessmentDescription, 60, 285, {
                align: "center",
                width: 722,
                lineGap: 1,
            });
        }
    }
    // Add score section
    static addScoreSection(doc, data) {
        const scoreY = data.assessmentDescription ? 310 : 295;
        // Score display
        doc
            .fontSize(14)
            .font("Helvetica-Bold")
            .fillColor("#059669")
            .text(`FINAL SCORE: ${data.score}/100 (${data.score}%)`, 60, scoreY, {
            align: "center",
            width: 722,
        });
        // Achievement level
        const achievement = this.getAchievementLevel(data.score);
        doc
            .fontSize(12)
            .font("Helvetica-Bold")
            .fillColor(achievement.color)
            .text(achievement.level, 60, scoreY + 20, {
            align: "center",
            width: 722,
        });
    }
    // Add dates section
    static addDatesSection(doc, data) {
        const scoreY = data.assessmentDescription ? 310 : 295;
        const dateY = scoreY + 50;
        const currentDate = new Date().toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
        const completedDate = data.completedAt.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
        // Assessment completion date
        doc
            .fontSize(10)
            .font("Helvetica")
            .fillColor("#374151")
            .text(`Assessment Completed: ${completedDate}`, 60, dateY, {
            align: "center",
            width: 722,
        });
        // Certificate issue date
        doc
            .fontSize(10)
            .font("Helvetica")
            .fillColor("#374151")
            .text(`Certificate Issued: ${currentDate}`, 60, dateY + 15, {
            align: "center",
            width: 722,
        });
        // Certificate ID
        doc
            .fontSize(9)
            .font("Helvetica-Bold")
            .fillColor("#6b7280")
            .text(`Certificate ID: ${data.certificateCode}`, 60, dateY + 35, {
            align: "center",
            width: 722,
        });
    }
    // Add footer section
    static addFooter(doc, qrY) {
        const qrSize = 55;
        const footerY = qrY + qrSize + 30;
        // Signature line
        const lineWidth = 200;
        const lineX = (842 - lineWidth) / 2;
        doc
            .moveTo(lineX, footerY)
            .lineTo(lineX + lineWidth, footerY)
            .strokeColor("#d1d5db")
            .lineWidth(1)
            .stroke();
        // Authorization text
        doc
            .fontSize(10)
            .font("Helvetica")
            .fillColor("#374151")
            .text("Authorized by Workoo", 60, footerY + 8, {
            align: "center",
            width: 722,
        });
    }
    // Calculate QR code position
    static calculateQRPosition(data) {
        const scoreY = data.assessmentDescription ? 310 : 295;
        const dateY = scoreY + 50;
        return dateY + 50;
    }
    // Get achievement level based on score
    static getAchievementLevel(score) {
        if (score >= 95) {
            return { level: "EXCELLENT PERFORMANCE", color: "#dc2626" };
        }
        else if (score >= 85) {
            return { level: "OUTSTANDING PERFORMANCE", color: "#ea580c" };
        }
        else if (score >= 75) {
            return { level: "GOOD PERFORMANCE", color: "#059669" };
        }
        else {
            return { level: "NEEDS IMPROVEMENT", color: "#6b7280" };
        }
    }
    // Convert PDF document to buffer
    static convertToBuffer(doc) {
        const chunks = [];
        doc.on("data", (chunk) => chunks.push(chunk));
        return new Promise((resolve, reject) => {
            doc.on("end", () => {
                try {
                    const pdfBuffer = Buffer.concat(chunks);
                    resolve(pdfBuffer);
                }
                catch (error) {
                    reject(error);
                }
            });
            doc.on("error", reject);
        });
    }
    // Add website logo to left top corner
    static async addWebsiteLogo(doc) {
        try {
            const logoPath = path.join(process.cwd(), "img_logo_pdf", "nobg_logo.png");
            // Check if logo file exists
            if (fs.existsSync(logoPath)) {
                const logoSize = 80; // Increased from 50 to 80
                const logoX = 40;
                const logoY = 40;
                doc.image(logoPath, logoX, logoY, {
                    width: logoSize,
                    height: logoSize,
                    fit: [logoSize, logoSize],
                    align: "center",
                    valign: "center",
                });
            }
            else {
                console.warn("Website logo not found at:", logoPath);
            }
        }
        catch (error) {
            console.error("Error adding website logo:", error);
        }
    }
    // Add badge logo to right top corner
    static async addBadgeLogo(doc, badgeIconUrl) {
        try {
            // For now, we'll use a local badge logo file
            // In the future, you could download the badge icon from URL and use it
            const badgeLogoPath = path.join(process.cwd(), "img_logo_pdf", "badge-logo.png");
            // Check if badge logo file exists
            if (fs.existsSync(badgeLogoPath)) {
                const logoSize = 50;
                const logoX = 842 - 40 - logoSize; // Page width - margin - logo size
                const logoY = 40;
                doc.image(badgeLogoPath, logoX, logoY, {
                    width: logoSize,
                    height: logoSize,
                    fit: [logoSize, logoSize],
                    align: "center",
                    valign: "center",
                });
            }
            else {
                console.warn("Badge logo not found at:", badgeLogoPath);
                // Fallback: try to use the badge icon URL directly (if it's a local file or supported format)
                if (badgeIconUrl &&
                    (badgeIconUrl.includes(".png") ||
                        badgeIconUrl.includes(".jpg") ||
                        badgeIconUrl.includes(".jpeg"))) {
                    try {
                        const logoSize = 50;
                        const logoX = 842 - 40 - logoSize;
                        const logoY = 40;
                        doc.image(badgeIconUrl, logoX, logoY, {
                            width: logoSize,
                            height: logoSize,
                            fit: [logoSize, logoSize],
                            align: "center",
                            valign: "center",
                        });
                    }
                    catch (urlError) {
                        console.error("Error loading badge icon from URL:", urlError);
                    }
                }
            }
        }
        catch (error) {
            console.error("Error adding badge logo:", error);
        }
    }
}
exports.PDFContentService = PDFContentService;
//# sourceMappingURL=pdfContent.service.js.map