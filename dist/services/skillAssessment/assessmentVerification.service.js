"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssessmentVerificationService = void 0;
const skillAssessmentModular_repository_1 = require("../../repositories/skillAssessment/skillAssessmentModular.repository");
const certificate_service_1 = require("./certificate.service");
const badgeManagement_service_1 = require("./badgeManagement.service");
const customError_1 = require("../../utils/customError");
const prisma_1 = require("../../generated/prisma");
class AssessmentVerificationService {
    // Verify certificate by code
    static async verifyCertificate(certificateCode) {
        const result = await skillAssessmentModular_repository_1.SkillAssessmentModularRepository.verifyCertificate(certificateCode);
        if (!result) {
            throw new customError_1.CustomError("Certificate not found", 404);
        }
        return {
            isValid: true,
            certificate: {
                id: result.id,
                certificateCode: result.certificateCode,
                userName: result.user.name,
                userEmail: result.user.email,
                assessmentTitle: result.assessment.title,
                assessmentDescription: result.assessment.description || result.assessment.title || "",
                score: result.score,
                completedAt: result.createdAt, // Use createdAt as completedAt
                issuedAt: result.createdAt,
            },
            verificationUrl: certificate_service_1.CertificateService.generateQRCodeData(certificateCode),
        };
    }
    // Download certificate PDF
    static async downloadCertificate(certificateCode, userId) {
        // Mock implementation - would typically get from repository
        const certificate = {
            certificateUrl: `https://example.com/certificates/${certificateCode}.pdf`,
            userId: userId || 1,
        };
        // If userId provided, verify ownership
        if (userId && certificate.userId !== userId) {
            throw new customError_1.CustomError("You can only download your own certificates", 403);
        }
        return {
            certificateUrl: certificate.certificateUrl,
            fileName: `certificate-${certificateCode}.pdf`,
        };
    }
    // Get user's certificates
    static async getUserCertificates(userId, page = 1, limit = 10) {
        // Mock implementation
        return {
            certificates: [],
            pagination: {
                page,
                limit,
                total: 0,
                totalPages: 0,
            },
        };
    }
    // Get user's badges
    static async getUserBadges(userId) {
        return await badgeManagement_service_1.BadgeManagementService.getUserBadges(userId);
    }
    // Get badge details
    static async getBadgeDetails(badgeId) {
        return await badgeManagement_service_1.BadgeManagementService.getBadgeDetails(badgeId);
    }
    // Verify badge authenticity
    static async verifyBadge(badgeId, userId) {
        const badge = await badgeManagement_service_1.BadgeManagementService.getBadgeDetails(badgeId);
        if (!badge) {
            throw new customError_1.CustomError("Badge not found", 404);
        }
        if (badge.userId !== userId) {
            throw new customError_1.CustomError("Badge does not belong to this user", 403);
        }
        return {
            isValid: true,
            badge: {
                id: badge.id,
                title: badge.badgeTemplate.title,
                description: badge.badgeTemplate.description,
                imageUrl: badge.badgeTemplate.imageUrl,
                earnedAt: badge.earnedAt,
                assessmentTitle: badge.assessment?.title,
                score: badge.score,
            },
        };
    }
    // Get assessment results for developer review
    static async getAssessmentResults(assessmentId, userId, userRole) {
        if (userRole !== prisma_1.UserRole.DEVELOPER) {
            throw new customError_1.CustomError("Only developers can access assessment results", 403);
        }
        // Mock implementation to avoid repository dependency
        return {
            results: [],
            assessmentId,
            total: 0,
        };
    }
    // Get certificate analytics (Developer only)
    static async getCertificateAnalytics(userRole) {
        if (userRole !== prisma_1.UserRole.DEVELOPER) {
            throw new customError_1.CustomError("Only developers can access certificate analytics", 403);
        }
        // Mock analytics data
        return {
            totalCertificatesIssued: 150,
            certificatesThisMonth: 25,
            topPerformingAssessments: [
                { title: "JavaScript Assessment", certificates: 45 },
                { title: "Python Assessment", certificates: 32 },
                { title: "React Assessment", certificates: 28 },
            ],
            averageScores: {
                javascript: 82,
                python: 78,
                react: 85,
            },
            passRates: {
                javascript: 75,
                python: 68,
                react: 80,
            },
        };
    }
    // Get badge analytics (Developer only)
    static async getBadgeAnalytics(userRole) {
        if (userRole !== prisma_1.UserRole.DEVELOPER) {
            throw new customError_1.CustomError("Only developers can access badge analytics", 403);
        }
        return await badgeManagement_service_1.BadgeManagementService.getBadgeAnalytics(userRole);
    }
    // Revoke certificate (Developer only)
    static async revokeCertificate(certificateCode, reason, userRole) {
        if (userRole !== prisma_1.UserRole.DEVELOPER) {
            throw new customError_1.CustomError("Only developers can revoke certificates", 403);
        }
        // Mock implementation
        return {
            success: true,
            message: "Certificate revoked successfully",
            certificateCode,
            reason,
            revokedAt: new Date(),
        };
    }
    // Regenerate certificate (if original is lost/corrupted)
    static async regenerateCertificate(assessmentResultId, userId) {
        // Mock result check
        const result = {
            id: assessmentResultId,
            userId: userId,
            user: { name: "John Doe", email: "john@example.com" },
            assessment: { title: "JavaScript Assessment", description: "Advanced JS concepts" },
            score: 85,
            totalQuestions: 25,
            completedAt: new Date(),
        };
        if (result.userId !== userId) {
            throw new customError_1.CustomError("You can only regenerate your own certificates", 403);
        }
        if (result.score < 75) {
            throw new customError_1.CustomError("Certificate can only be regenerated for passed assessments", 400);
        }
        // Generate new certificate
        const certificateData = await certificate_service_1.CertificateService.generateCertificate({
            userName: result.user.name,
            userEmail: result.user.email,
            assessmentTitle: result.assessment.title,
            assessmentDescription: result.assessment.description,
            score: result.score,
            totalQuestions: result.totalQuestions,
            completedAt: result.completedAt,
            userId: result.userId,
        });
        return certificateData;
    }
    // Bulk certificate verification (for employers)
    static async bulkVerifyCertificates(certificateCodes) {
        if (certificateCodes.length > 50) {
            throw new customError_1.CustomError("Cannot verify more than 50 certificates at once", 400);
        }
        const results = await Promise.allSettled(certificateCodes.map(code => this.verifyCertificate(code)));
        return results.map((result, index) => ({
            certificateCode: certificateCodes[index],
            isValid: result.status === 'fulfilled',
            data: result.status === 'fulfilled' ? result.value : null,
            error: result.status === 'rejected' ? result.reason.message : null,
        }));
    }
    // Get verification statistics
    static async getVerificationStats(userRole) {
        if (userRole !== prisma_1.UserRole.DEVELOPER) {
            throw new customError_1.CustomError("Only developers can access verification statistics", 403);
        }
        // Mock verification stats
        return {
            totalVerifications: 500,
            verificationsToday: 12,
            verificationsThisWeek: 85,
            verificationsThisMonth: 320,
            topVerifiedCertificates: [
                { certificateCode: "CERT-ABC123", verifications: 25 },
                { certificateCode: "CERT-DEF456", verifications: 18 },
                { certificateCode: "CERT-GHI789", verifications: 15 },
            ],
        };
    }
    // Share certificate to social media
    static async shareCertificate(certificateCode, platform, userId) {
        // Mock certificate check
        const certificate = {
            userId: userId,
            assessment: { title: "JavaScript Assessment" },
            score: 95,
        };
        if (certificate.userId !== userId) {
            throw new customError_1.CustomError("You can only share your own certificates", 403);
        }
        const shareUrl = `${process.env.FRONTEND_URL}/verify-certificate/${certificateCode}`;
        const shareText = `I just earned a certificate in ${certificate.assessment.title} with a score of ${certificate.score}%! 🎓`;
        const shareLinks = {
            linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(shareText)}`,
            facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`,
            twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
            whatsapp: `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`,
        };
        if (!shareLinks[platform]) {
            throw new customError_1.CustomError("Unsupported social media platform", 400);
        }
        // Log share activity (mock implementation)
        // await SkillAssessmentRepository.logCertificateShare(certificateCode, platform);
        return {
            shareUrl: shareLinks[platform],
            platform,
            certificateUrl: shareUrl,
        };
    }
}
exports.AssessmentVerificationService = AssessmentVerificationService;
//# sourceMappingURL=assessmentVerification.service.js.map