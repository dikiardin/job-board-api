export declare class CertificateDataService {
    static buildCertificateResponse(result: any): {
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
    };
    static buildDownloadResponse(certificateCode: string): {
        certificateUrl: string;
        fileName: string;
    };
    static buildPaginationResponse(page: number, limit: number, total: number): {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
    static buildBulkVerificationResult(certificateCodes: string[], results: any[]): {
        certificateCode: string | undefined;
        isValid: boolean;
        data: any;
        error: any;
    }[];
}
//# sourceMappingURL=CertificateDataService.d.ts.map