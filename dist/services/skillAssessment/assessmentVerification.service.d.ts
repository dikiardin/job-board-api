import { UserRole } from "../../generated/prisma";
export declare class AssessmentVerificationService {
    static verifyCertificate(certificateCode: string): Promise<{
        isValid: boolean;
        certificate: {
            id: number;
            certificateCode: string | null;
            userName: string;
            userEmail: string;
            assessmentTitle: string;
            assessmentDescription: any;
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
    static getUserBadges(userId: number): Promise<{
        badges: {
            id: number;
            badgeTemplate: {
                title: string;
                description: string;
                imageUrl: string;
            };
            earnedAt: Date;
            score: number;
        }[];
        totalBadges: number;
    }>;
    static getBadgeDetails(badgeId: number): Promise<{
        id: number;
        badgeTemplate: {
            title: string;
            description: string;
            imageUrl: string;
        };
        userId: number;
        earnedAt: Date;
        score: number;
        assessment: {
            title: string;
        };
    }>;
    static verifyBadge(badgeId: number, userId: number): Promise<{
        isValid: boolean;
        badge: {
            id: number;
            title: string;
            description: string;
            imageUrl: string;
            earnedAt: Date;
            assessmentTitle: string;
            score: number;
        };
    }>;
    static getAssessmentResults(assessmentId: number, userId: number, userRole: UserRole): Promise<{
        results: never[];
        assessmentId: number;
        total: number;
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
    static getBadgeAnalytics(userRole: UserRole): Promise<{
        totalBadgesAwarded: number;
        badgesThisMonth: number;
        topBadges: {
            title: string;
            awarded: number;
        }[];
        badgesByCategory: {
            programming: number;
            frameworks: number;
            databases: number;
        };
    }>;
    static revokeCertificate(certificateCode: string, reason: string, userRole: UserRole): Promise<{
        success: boolean;
        message: string;
        certificateCode: string;
        reason: string;
        revokedAt: Date;
    }>;
    static regenerateCertificate(assessmentResultId: number, userId: number): Promise<{
        certificateUrl: string;
        certificateCode: string;
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
                assessmentDescription: any;
                score: number;
                completedAt: Date;
                issuedAt: Date;
            };
            verificationUrl: string;
        } | null;
        error: any;
    }[]>;
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
    static shareCertificate(certificateCode: string, platform: string, userId: number): Promise<{
        shareUrl: string;
        platform: string;
        certificateUrl: string;
    }>;
}
//# sourceMappingURL=assessmentVerification.service.d.ts.map