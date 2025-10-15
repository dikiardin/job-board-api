export declare class CertificateManagementService {
    static downloadCertificate(certificateCode: string, userId?: number): Promise<{
        certificateUrl: string;
        fileName: string;
    }>;
    static shareCertificate(certificateCode: string, platform: string, userId: number): Promise<{
        shareUrl: string;
        platform: string;
        shareText: string;
    }>;
}
//# sourceMappingURL=CertificateManagementService.d.ts.map