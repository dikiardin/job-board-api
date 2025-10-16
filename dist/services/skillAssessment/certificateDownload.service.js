"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CertificateDownloadService = void 0;
const customError_1 = require("../../utils/customError");
class CertificateDownloadService {
    static async streamCertificateToResponse(certificateData, res, forceDownload = true) {
        const response = await CertificateDownloadService.fetchCertificatePDF(certificateData.certificateUrl);
        const buffer = await response.arrayBuffer();
        const pdfBuffer = Buffer.from(buffer);
        CertificateDownloadService.validatePDFBuffer(pdfBuffer);
        CertificateDownloadService.setPDFHeaders(res, certificateData.certificateCode, forceDownload);
        res.send(pdfBuffer);
    }
    static async fetchCertificatePDF(certificateUrl) {
        let response = await fetch(certificateUrl);
        if (!response.ok) {
            const urlWithoutPdf = certificateUrl.replace('.pdf', '');
            response = await fetch(urlWithoutPdf);
        }
        if (!response.ok) {
            throw new customError_1.CustomError('Certificate file not found', 404);
        }
        return response;
    }
    static validatePDFBuffer(pdfBuffer) {
        const pdfHeader = pdfBuffer.toString('ascii', 0, 4);
        if (!pdfHeader.startsWith('%PDF')) {
            throw new customError_1.CustomError('Invalid certificate file', 500);
        }
    }
    static setPDFHeaders(res, certificateCode, forceDownload = true) {
        res.setHeader('Content-Type', 'application/pdf');
        if (forceDownload) {
            // Force download
            res.setHeader('Content-Disposition', `attachment; filename="certificate-${certificateCode}.pdf"`);
        }
        else {
            // Inline view in browser
            res.setHeader('Content-Disposition', `inline; filename="certificate-${certificateCode}.pdf"`);
        }
        res.setHeader('Cache-Control', 'no-cache');
    }
}
exports.CertificateDownloadService = CertificateDownloadService;
