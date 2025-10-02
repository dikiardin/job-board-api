"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SkillAssessmentService = void 0;
const skillAssessmentModular_repository_1 = require("../../repositories/skillAssessment/skillAssessmentModular.repository");
const certificate_service_1 = require("./certificate.service");
const badge_service_1 = require("./badge.service");
const customError_1 = require("../../utils/customError");
const prisma_1 = require("../../generated/prisma");
const prisma_2 = require("../../config/prisma");
class SkillAssessmentService {
    // Create assessment (Developer only)
    static async createAssessment(data) {
        // Validate developer role
        if (data.userRole !== prisma_1.UserRole.DEVELOPER) {
            throw new customError_1.CustomError("Only developers can create assessments", 403);
        }
        // Validate questions count (min 1)
        if (data.questions.length < 1) {
            throw new customError_1.CustomError("Assessment must have at least 1 question", 400);
        }
        // Validate each question
        data.questions.forEach((q, index) => {
            if (!q.question || q.options.length !== 4 || !q.answer) {
                throw new customError_1.CustomError(`Question ${index + 1} is invalid`, 400);
            }
            if (!q.options.includes(q.answer)) {
                throw new customError_1.CustomError(`Question ${index + 1} answer must be one of the options`, 400);
            }
        });
        return await skillAssessmentModular_repository_1.SkillAssessmentModularRepository.createAssessment(data);
    }
    // Get all assessments for discovery
    static async getAssessments(page = 1, limit = 10) {
        return await skillAssessmentModular_repository_1.SkillAssessmentModularRepository.getAllAssessments(page, limit);
    }
    // Get assessment for taking (hide answers)
    static async getAssessmentForUser(assessmentId, userId) {
        // Check if user already took this assessment
        const existingResult = await skillAssessmentModular_repository_1.SkillAssessmentModularRepository.getUserResult(userId, assessmentId);
        if (existingResult) {
            throw new customError_1.CustomError("You have already taken this assessment", 400);
        }
        const assessment = await skillAssessmentModular_repository_1.SkillAssessmentModularRepository.getAssessmentById(assessmentId);
        if (!assessment) {
            throw new customError_1.CustomError("Assessment not found", 404);
        }
        return assessment;
    }
    // Submit assessment answers
    static async submitAssessment(data) {
        // Check if user already took this assessment
        const existingResult = await skillAssessmentModular_repository_1.SkillAssessmentModularRepository.getUserResult(data.userId, data.assessmentId);
        if (existingResult) {
            throw new customError_1.CustomError("You have already taken this assessment", 400);
        }
        // Get assessment with correct answers
        const assessment = await skillAssessmentModular_repository_1.SkillAssessmentModularRepository.getAssessmentById(data.assessmentId);
        if (!assessment) {
            throw new customError_1.CustomError("Assessment not found", 404);
        }
        // Set finished time (no time limit validation since we removed startedAt)
        const finishedAt = new Date();
        // Validate all questions answered
        if (data.answers.length !== 25) {
            throw new customError_1.CustomError("All 25 questions must be answered", 400);
        }
        // Calculate score
        let correctAnswers = 0;
        const questionMap = new Map(assessment.questions.map((q) => [q.id, q.answer]));
        for (const answer of data.answers) {
            const correctAnswer = questionMap.get(answer.questionId);
            if (correctAnswer === answer.selectedAnswer) {
                correctAnswers++;
            }
        }
        // Convert to 100-point scale
        const score = Math.round((correctAnswers / 25) * 100);
        const isPassed = score >= 75; // 75% passing grade
        let certificateUrl;
        let certificateCode;
        // Generate certificate if passed
        if (isPassed) {
            const user = await this.getUserInfo(data.userId);
            const certificateData = {
                userName: user.name,
                userEmail: user.email,
                assessmentTitle: assessment.title,
                score,
                totalQuestions: 25,
                completedAt: finishedAt,
                userId: data.userId,
            };
            if (assessment.description) {
                certificateData.assessmentDescription = assessment.description;
            }
            const certificate = await certificate_service_1.CertificateService.generateCertificate(certificateData);
            certificateUrl = certificate.certificateUrl;
            certificateCode = certificate.certificateCode;
        }
        // Create result record
        const resultData = {
            userId: data.userId,
            assessmentId: data.assessmentId,
            score,
            isPassed,
            startedAt: finishedAt, // Use finishedAt as startedAt since we don't track start time
            finishedAt,
        };
        if (certificateUrl)
            resultData.certificateUrl = certificateUrl;
        if (certificateCode)
            resultData.certificateCode = certificateCode;
        const result = await skillAssessmentModular_repository_1.SkillAssessmentModularRepository.saveAssessmentResult(resultData);
        // Award badge if passed
        if (isPassed) {
            await badge_service_1.BadgeService.awardBadgeFromAssessment(data.userId, data.assessmentId, correctAnswers, 25);
            await badge_service_1.BadgeService.checkMilestoneBadges(data.userId);
        }
        return {
            ...result,
            percentage: score, // Score is already in 100-point scale
        };
    }
    // Get user's assessment results
    static async getUserResults(userId) {
        return await skillAssessmentModular_repository_1.SkillAssessmentModularRepository.getUserResults(userId);
    }
    // Get developer's assessments
    static async getDeveloperAssessments(userId, userRole) {
        if (userRole !== prisma_1.UserRole.DEVELOPER) {
            throw new customError_1.CustomError("Only developers can view their assessments", 403);
        }
        return await skillAssessmentModular_repository_1.SkillAssessmentModularRepository.getDeveloperAssessments(userId);
    }
    // Get single assessment by ID for developer (includes questions)
    static async getAssessmentByIdForDeveloper(assessmentId, userId, userRole) {
        if (userRole !== prisma_1.UserRole.DEVELOPER) {
            throw new customError_1.CustomError("Only developers can view assessment details", 403);
        }
        const assessment = await skillAssessmentModular_repository_1.SkillAssessmentModularRepository.getAssessmentById(assessmentId);
        if (!assessment) {
            throw new customError_1.CustomError("Assessment not found", 404);
        }
        // Check if developer owns this assessment
        if (assessment.createdBy !== userId) {
            throw new customError_1.CustomError("You can only view your own assessments", 403);
        }
        return assessment;
    }
    // Get assessment results (Developer only)
    static async getAssessmentResults(assessmentId, userId, userRole) {
        if (userRole !== prisma_1.UserRole.DEVELOPER) {
            throw new customError_1.CustomError("Only developers can view assessment results", 403);
        }
        return await skillAssessmentModular_repository_1.SkillAssessmentModularRepository.getAssessmentResults(assessmentId);
    }
    // Verify certificate
    static async verifyCertificate(certificateCode) {
        const result = await skillAssessmentModular_repository_1.SkillAssessmentModularRepository.verifyCertificate(certificateCode);
        if (!result) {
            throw new customError_1.CustomError("Certificate not found", 404);
        }
        return {
            isValid: true,
            certificate: result,
            verificationUrl: certificate_service_1.CertificateService.generateQRCodeData(certificateCode),
        };
    }
    // Update assessment (Developer only)
    static async updateAssessment(assessmentId, userId, userRole, data) {
        if (userRole !== prisma_1.UserRole.DEVELOPER) {
            throw new customError_1.CustomError("Only developers can update assessments", 403);
        }
        // Validate questions if provided
        if (data.questions) {
            if (data.questions.length < 1) {
                throw new customError_1.CustomError("Assessment must have at least 1 question", 400);
            }
            // Validate each question
            data.questions.forEach((q, index) => {
                if (!q.question || q.options.length !== 4 || !q.answer) {
                    throw new customError_1.CustomError(`Question ${index + 1} is invalid`, 400);
                }
                if (!q.options.includes(q.answer)) {
                    throw new customError_1.CustomError(`Question ${index + 1} answer must be one of the options`, 400);
                }
            });
        }
        const updated = await skillAssessmentModular_repository_1.SkillAssessmentModularRepository.updateAssessment(assessmentId, userId, data);
        if (!updated) {
            throw new customError_1.CustomError("Assessment not found or you don't have permission", 404);
        }
        return { message: "Assessment updated successfully" };
    }
    // Delete assessment (Developer only)
    static async deleteAssessment(assessmentId, userId, userRole) {
        if (userRole !== prisma_1.UserRole.DEVELOPER) {
            throw new customError_1.CustomError("Only developers can delete assessments", 403);
        }
        const deleted = await skillAssessmentModular_repository_1.SkillAssessmentModularRepository.deleteAssessment(assessmentId, userId);
        if (!deleted) {
            throw new customError_1.CustomError("Assessment not found or you don't have permission", 404);
        }
        return { message: "Assessment deleted successfully" };
    }
    // Download certificate (User only)
    static async downloadCertificate(resultId, userId) {
        // Get result by ID and verify ownership
        const result = await prisma_2.prisma.skillResult.findFirst({
            where: {
                id: resultId,
                userId: userId // Verify the result belongs to this user
            },
            include: {
                assessment: {
                    select: { id: true, title: true },
                },
            },
        });
        if (!result) {
            throw new customError_1.CustomError("Certificate not found or you don't have permission", 404);
        }
        if (!result.certificateUrl) {
            throw new customError_1.CustomError("Certificate not available for this result", 400);
        }
        return {
            certificateUrl: result.certificateUrl,
            certificateCode: result.certificateCode,
            assessment: result.assessment,
        };
    }
    // Helper method to get user info
    static async getUserInfo(userId) {
        const user = await prisma_2.prisma.user.findUnique({
            where: { id: userId },
            select: {
                name: true,
                email: true,
            },
        });
        if (!user) {
            throw new customError_1.CustomError("User not found", 404);
        }
        return {
            name: user.name,
            email: user.email,
        };
    }
    // Get assessment for taking (User with subscription)
    static async getAssessmentForTaking(assessmentId, userId) {
        return await this.getAssessmentForUser(assessmentId, userId);
    }
    // Get user certificates
    static async getUserCertificates(userId, page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        const results = await prisma_2.prisma.skillResult.findMany({
            where: {
                userId,
                isPassed: true,
                certificateUrl: { not: null },
            },
            skip,
            take: limit,
            include: {
                assessment: {
                    select: { id: true, title: true, description: true },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
        const total = await prisma_2.prisma.skillResult.count({
            where: {
                userId,
                isPassed: true,
                certificateUrl: { not: null },
            },
        });
        return {
            certificates: results,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    // Share certificate to social media
    static async shareCertificate(code, platform, userId) {
        const result = await this.verifyCertificate(code);
        const shareUrl = `${process.env.FRONTEND_URL}/verify-certificate/${code}`;
        const shareText = `I just earned a certificate with a score of ${result.certificate.score}%! 🎓`;
        const shareLinks = {
            linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
            facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
            twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
            whatsapp: `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`,
        };
        if (!shareLinks[platform]) {
            throw new customError_1.CustomError("Unsupported social media platform", 400);
        }
        return {
            shareUrl: shareLinks[platform],
            platform,
            certificateUrl: shareUrl,
        };
    }
    // Get assessment leaderboard
    static async getAssessmentLeaderboard(assessmentId, limit = 10) {
        return await skillAssessmentModular_repository_1.SkillAssessmentModularRepository.getAssessmentLeaderboard(assessmentId, limit);
    }
    // Get assessment statistics
    static async getAssessmentStats(assessmentId) {
        return await skillAssessmentModular_repository_1.SkillAssessmentModularRepository.getAssessmentStatistics(assessmentId);
    }
}
exports.SkillAssessmentService = SkillAssessmentService;
//# sourceMappingURL=skillAssessment.service.js.map