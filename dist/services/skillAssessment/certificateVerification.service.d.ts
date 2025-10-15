export declare class CertificateVerificationService {
    static verifyCertificate(certificateCode: string): Promise<{
        isValid: boolean;
        certificate: {
            id: any;
            certificateCode: any;
            userName: any;
            userEmail: any;
            assessmentTitle: any;
            score: any;
            completedAt: any;
            issuedAt: any;
        };
        verificationUrl: string;
    }>;
    static downloadCertificate(userId: number, resultId: number): Promise<{
        certificateUrl: string;
        fileName: string;
    }>;
    static getUserCertificates(userId: number, page?: number, limit?: number): Promise<{
        certificates: any[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    static bulkVerifyCertificates(certificateCodes: string[]): Promise<{
        certificateCode: string | undefined;
        isValid: boolean;
        data: any;
        error: any;
    }[]>;
    static shareCertificate(certificateCode: string, platform: string, userId: number): Promise<{
        shareUrl: string;
        platform: string;
        shareText: string;
    }>;
}
//# sourceMappingURL=certificateVerification.service.d.ts.map