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
const qrCodeGeneration_service_1 = require("./qrCodeGeneration.service");
const pdfContent_service_1 = require("./pdfContent.service");
class PDFLayoutService {
    static async generateCertificatePDF(data) {
        // Create PDF document
        const doc = new PDFKit.default({
            size: "A4",
            layout: "landscape",
            margins: { top: 40, bottom: 40, left: 60, right: 60 },
            bufferPages: true,
        });
        // Add header and content using PDFContentService
        await pdfContent_service_1.PDFContentService.addHeader(doc, data.badgeIcon);
        pdfContent_service_1.PDFContentService.addCertificateBody(doc, data);
        pdfContent_service_1.PDFContentService.addScoreSection(doc, data);
        pdfContent_service_1.PDFContentService.addDatesSection(doc, data);
        // Add QR code
        const qrY = pdfContent_service_1.PDFContentService.calculateQRPosition(data);
        await qrCodeGeneration_service_1.QRCodeGenerationService.addQRCodeToPDF(doc, data.certificateCode, qrY);
        // Add footer
        pdfContent_service_1.PDFContentService.addFooter(doc, qrY);
        // Ensure single page
        if (doc.bufferedPageRange().count > 1) {
            console.warn("Certificate generated multiple pages, content may be too large");
        }
        // End the document
        doc.end();
        // Convert PDF to buffer
        return pdfContent_service_1.PDFContentService.convertToBuffer(doc);
    }
}
exports.PDFLayoutService = PDFLayoutService;
//# sourceMappingURL=pdfLayout.service.js.map