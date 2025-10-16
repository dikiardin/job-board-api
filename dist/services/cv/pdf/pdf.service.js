"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pdfService = exports.PDFService = void 0;
const pdf_core_service_1 = require("./pdf.core.service");
class PDFService {
    async generatePDF(cvData, templateType = 'ats') {
        return pdf_core_service_1.pdfCoreService.generatePDF(cvData, templateType);
    }
}
exports.PDFService = PDFService;
exports.pdfService = new PDFService();
