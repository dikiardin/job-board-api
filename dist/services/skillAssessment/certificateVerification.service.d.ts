import { UserRole } from "../../generated/prisma";
export declare class CertificateVerificationService {
    static verifyCertificate(certificateCode: string): Promise<{
        isValid: boolean;
        certificate: {
            id: number;
            certificateCode: string | null;
            userName: string;
            userEmail: string;
            assessmentTitle: string;
            score: number;
            completedAt: Date;
            issuedAt: Date;
        };
        verificationUrl: string;
    }>;
    static downloadCertificate(certificateCode: string, userId?: number): Promise<{
        certificateUrl: string;
        fileName: string;
    }>;
    static getUserCertificates(userId: number, page?: number, limit?: number): Promise<{
        certificates: never[];
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
        data: {
            isValid: boolean;
            certificate: {
                id: number;
                certificateCode: string | null;
                userName: string;
                userEmail: string;
                assessmentTitle: string;
                score: number;
                completedAt: Date;
                issuedAt: Date;
            };
            verificationUrl: string;
        } | null;
        error: any;
    }[]>;
    static shareCertificate(certificateCode: string, platform: string, userId: number): Promise<{
        shareUrl: string;
        platform: string;
        certificateUrl: string;
    }>;
    static revokeCertificate(certificateCode: string, reason: string, userRole: UserRole): Promise<{
        success: boolean;
        message: string;
        certificateCode: string;
        reason: string;
        revokedAt: Date;
    }>;
    static getCertificateAnalytics(userRole: UserRole): Promise<{
        totalCertificatesIssued: number;
        certificatesThisMonth: number;
        topPerformingAssessments: {
            title: string;
            certificates: number;
        }[];
        averageScores: {
            javascript: number;
            python: number;
            react: number;
        };
        passRates: {
            javascript: number;
            python: number;
            react: number;
        };
    }>;
    static getVerificationStats(userRole: UserRole): Promise<{
        totalVerifications: number;
        verificationsToday: number;
        verificationsThisWeek: number;
        verificationsThisMonth: number;
        topVerifiedCertificates: {
            certificateCode: string;
            verifications: number;
        }[];
    }>;
    static regenerateCertificate(assessmentResultId: number, userId: number): Promise<{
        certificateUrl: string;
        certificateCode: string;
    }>;
    static validateCertificateCode(certificateCode: string): boolean;
    static getCertificateStatus(issuedAt: Date): {
        status: 'valid' | 'expiring' | 'expired';
        daysRemaining?: number;
        message: string;
    };
}
//# sourceMappingURL=certificateVerification.service.d.ts.map