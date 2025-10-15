"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssessmentExecutionQueryService = void 0;
const skillAssessmentModular_repository_1 = require("../../repositories/skillAssessment/skillAssessmentModular.repository");
const customError_1 = require("../../utils/customError");
const prisma_1 = require("../../config/prisma");
class AssessmentExecutionQueryService {
    // Get assessment for taking (hide answers, subscription required)
    static async getAssessmentForTaking(assessmentId, userId) {
        // Check if user has active subscription
        const hasSubscription = await this.checkUserSubscription(userId);
        if (!hasSubscription) {
            throw new customError_1.CustomError("Active subscription required to take assessments", 403);
        }
        // Check if user already completed this assessment
        const existingResult = await skillAssessmentModular_repository_1.SkillAssessmentModularRepository.getUserResult(userId, assessmentId);
        if (existingResult) {
            throw new customError_1.CustomError("You have already completed this assessment", 400);
        }
        const assessments = await skillAssessmentModular_repository_1.SkillAssessmentModularRepository.getAllAssessments(1, 1000);
        const assessment = assessments.assessments?.find((a) => a.id === assessmentId);
        if (!assessment) {
            throw new customError_1.CustomError("Assessment not found", 404);
        }
        // Mock questions for taking (since we don't have real questions structure)
        const questionsForTaking = Array.from({ length: 25 }, (_, index) => ({
            id: index + 1,
            question: `Sample question ${index + 1} for ${assessment.title}`,
            options: ["Option A", "Option B", "Option C", "Option D"],
        }));
        return {
            id: assessment.id,
            title: assessment.title,
            description: assessment.description || "",
            questions: questionsForTaking,
            timeLimit: this.TIME_LIMIT_MINUTES,
            totalQuestions: questionsForTaking.length,
            passingScore: assessment.passScore,
        };
    }
    // Get user information
    static async getUserInfo(userId) {
        const user = await prisma_1.prisma.user.findUnique({
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
    // Get assessment leaderboard
    static async getAssessmentLeaderboard(assessmentId, limit = 10) {
        // Mock implementation
        return {
            leaderboard: [],
            assessmentId,
            limit,
        };
    }
    // Get assessment statistics for users
    static async getAssessmentStats(assessmentId) {
        // Mock implementation to avoid repository dependency
        return {
            totalAttempts: 0,
            averageScore: 0,
            passRate: 0,
        };
    }
    // Check if retake is allowed
    static async canRetakeAssessment(userId, assessmentId) {
        const existingResult = await skillAssessmentModular_repository_1.SkillAssessmentModularRepository.getUserResult(userId, assessmentId);
        // Can retake if no previous attempt or if failed
        return !existingResult || !existingResult.isPassed;
    }
    // Validate assessment exists and is active
    static async validateAssessmentExists(assessmentId) {
        const assessment = await skillAssessmentModular_repository_1.SkillAssessmentModularRepository.getAssessmentById(assessmentId);
        if (!assessment) {
            throw new customError_1.CustomError("Assessment not found", 404);
        }
        return assessment;
    }
    // Check user subscription status
    static async checkUserSubscription(userId) {
        const subscription = await prisma_1.prisma.subscription.findFirst({
            where: {
                userId,
                expiresAt: {
                    gte: new Date(),
                },
            },
        });
        return !!subscription;
    }
}
exports.AssessmentExecutionQueryService = AssessmentExecutionQueryService;
AssessmentExecutionQueryService.TIME_LIMIT_MINUTES = 3; // Changed from 30 to 3 minutes to match frontend
//# sourceMappingURL=assessmentExecutionQuery.service.js.map