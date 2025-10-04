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
class PDFLayoutService {
    static async generateCertificatePDF(data) {
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