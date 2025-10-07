import { Response } from "express";
import { CustomError } from "../../utils/customError";

export class CertificateDownloadService {
  public static async streamCertificateToResponse(
    certificateData: any,
    res: Response,
    forceDownload: boolean = true
  ) {
    const response = await CertificateDownloadService.fetchCertificatePDF(
      certificateData.certificateUrl
    );
    
    const buffer = await response.arrayBuffer();
    const pdfBuffer = Buffer.from(buffer);
    
    CertificateDownloadService.validatePDFBuffer(pdfBuffer);
    CertificateDownloadService.setPDFHeaders(res, certificateData.certificateCode, forceDownload);
    
    res.send(pdfBuffer);
  }

  private static async fetchCertificatePDF(certificateUrl: string) {
    let response = await fetch(certificateUrl);

    if (!response.ok) {
      const urlWithoutPdf = certificateUrl.replace('.pdf', '');
      response = await fetch(urlWithoutPdf);
    }

    if (!response.ok) {
      throw new CustomError('Certificate file not found', 404);
    }

    return response;
  }

  private static validatePDFBuffer(pdfBuffer: Buffer) {
    const pdfHeader = pdfBuffer.toString('ascii', 0, 4);
    
    if (!pdfHeader.startsWith('%PDF')) {
      throw new CustomError('Invalid certificate file', 500);
    }
  }

  private static setPDFHeaders(res: Response, certificateCode: string, forceDownload: boolean = true) {
    res.setHeader('Content-Type', 'application/pdf');
    
    if (forceDownload) {
      // Force download
      res.setHeader('Content-Disposition', `attachment; filename="certificate-${certificateCode}.pdf"`);
    } else {
      // Inline view in browser
      res.setHeader('Content-Disposition', `inline; filename="certificate-${certificateCode}.pdf"`);
    }
    
    res.setHeader('Cache-Control', 'no-cache');
  }
}
