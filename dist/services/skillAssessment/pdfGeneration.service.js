"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PDFGenerationService = void 0;
const pdfLayout_service_1 = require("./pdfLayout.service");
class PDFGenerationService {
    static async generateCertificatePDF(data) {
        // Delegate to PDF layout service
        return await pdfLayout_service_1.PDFLayoutService.generateCertificatePDF(data);
    }
}
exports.PDFGenerationService = PDFGenerationService;
