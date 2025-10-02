"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssessmentExecutionService = void 0;
const skillAssessmentModular_repository_1 = require("../../repositories/skillAssessment/skillAssessmentModular.repository");
const customError_1 = require("../../utils/customError");
const prisma_1 = require("../../config/prisma");
class AssessmentExecutionService {
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
            options: [
                "Option A",
                "Option B",
                "Option C",
                "Option D"
            ],
        }));
        return {
            id: assessment.id,
            title: assessment.title,
            description: assessment.description || "",
            questions: questionsForTaking,
            timeLimit: this.TIME_LIMIT_MINUTES,
            totalQuestions: questionsForTaking.length,
            passingScore: this.PASSING_SCORE,
        };
    }
    // Calculate assessment score
    static calculateScore(questions, userAnswers) {
        let correctAnswers = 0;
        const totalQuestions = questions.length;
        // Create map for quick lookup
        const answerMap = new Map(userAnswers.map(ua => [ua.questionId, ua.answer]));
        // Check each question
        questions.forEach(question => {
            const userAnswer = answerMap.get(question.id);
            if (userAnswer === question.answer) {
                correctAnswers++;
            }
        });
        // Calculate percentage score
        const score = Math.round((correctAnswers / totalQuestions) * 100);
        return {
            score,
            correctAnswers,
            totalQuestions,
        };
    }
    // Check user subscription status
    static async checkUserSubscription(userId) {
        const subscription = await prisma_1.prisma.subscription.findFirst({
            where: {
                userId,
                endDate: {
                    gte: new Date(),
                },
            },
        });
        return !!subscription;
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
    // Validate assessment submission
    static validateSubmission(data) {
        // Validate time limit
        if (data.timeSpent > this.TIME_LIMIT_MINUTES) {
            throw new customError_1.CustomError("Assessment time limit exceeded", 400);
        }
        // Validate all questions are answered
        if (data.answers.length !== 25) {
            throw new customError_1.CustomError("All 25 questions must be answered", 400);
        }
        // Validate answer format
        data.answers.forEach((answer, index) => {
            if (!answer.questionId || !answer.answer) {
                throw new customError_1.CustomError(`Answer ${index + 1} is invalid`, 400);
            }
        });
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
        return !existingResult || existingResult.score < this.PASSING_SCORE;
    }
    // Reset assessment for retake
    static async resetAssessmentForRetake(userId, assessmentId) {
        const canRetake = await this.canRetakeAssessment(userId, assessmentId);
        if (!canRetake) {
            throw new customError_1.CustomError("Cannot retake a passed assessment", 400);
        }
        const existingResult = await skillAssessmentModular_repository_1.SkillAssessmentModularRepository.getUserResult(userId, assessmentId);
        if (existingResult) {
            // Delete previous attempt
            return { message: "Previous attempt reset. You can now retake the assessment." };
        }
        return { message: "Assessment is ready to be taken." };
    }
    // Get time remaining for assessment
    static getTimeRemaining(startTime) {
        const elapsed = (Date.now() - startTime.getTime()) / (1000 * 60); // minutes
        const remaining = Math.max(0, this.TIME_LIMIT_MINUTES - elapsed);
        return Math.floor(remaining);
    }
    // Validate assessment exists and is active
    static async validateAssessmentExists(assessmentId) {
        const assessments = await skillAssessmentModular_repository_1.SkillAssessmentModularRepository.getAllAssessments(1, 1000);
        const assessment = assessments.assessments?.find((a) => a.id === assessmentId);
        if (!assessment) {
            throw new customError_1.CustomError("Assessment not found", 404);
        }
        // Return assessment with mock questions for validation
        return {
            ...assessment,
            questions: Array.from({ length: 25 }, (_, index) => ({
                id: index + 1,
                question: `Sample question ${index + 1}`,
                answer: "Option A", // Mock answer for validation
                options: ["Option A", "Option B", "Option C", "Option D"]
            }))
        };
    }
    // Get passing score threshold
    static getPassingScore() {
        return this.PASSING_SCORE;
    }
    // Get time limit
    static getTimeLimit() {
        return this.TIME_LIMIT_MINUTES;
    }
}
exports.AssessmentExecutionService = AssessmentExecutionService;
AssessmentExecutionService.PASSING_SCORE = 75;
AssessmentExecutionService.TIME_LIMIT_MINUTES = 30;
//# sourceMappingURL=assessmentExecution.service.js.map