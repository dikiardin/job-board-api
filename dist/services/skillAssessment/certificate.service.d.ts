export declare class CertificateService {
    static generateCertificate(data: {
        userName: string;
        userEmail: string;
        assessmentTitle: string;
        assessmentDescription?: string;
        score: number;
        totalQuestions: number;
        completedAt: Date;
        userId: number;
        badgeIcon?: string;
    }): Promise<{
        certificateUrl: string;
        certificateCode: string;
    }>;
    static generateQRCodeData(certificateCode: string): string;
    static verifyCertificate(certificateCode: string): Promise<{
        isValid: boolean;
        verificationUrl: string;
    }>;
}
//# sourceMappingURL=certificate.service.d.ts.map