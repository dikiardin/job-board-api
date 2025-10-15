import { Response } from "express";
export declare class CertificateDownloadService {
    static streamCertificateToResponse(certificateData: any, res: Response, forceDownload?: boolean): Promise<void>;
    private static fetchCertificatePDF;
    private static validatePDFBuffer;
    private static setPDFHeaders;
}
//# sourceMappingURL=certificateDownload.service.d.ts.map