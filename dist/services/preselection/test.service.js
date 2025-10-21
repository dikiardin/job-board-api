"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.PreselectionTestService = void 0;
const prisma_1 = require("../../generated/prisma");
class PreselectionTestService {
    static async createOrUpdateTest(params, dependencies) {
        const { jobId, requesterId, requesterRole, questions, passingScore, isActive = true } = params;
        dependencies.validateAdminAccess(requesterRole);
        await dependencies.validateJobOwnership(jobId, requesterId);
        // Allow disabling test without providing 25 questions
        if (isActive) {
            dependencies.validateQuestions(questions);
            dependencies.validatePassingScore(passingScore, questions.length);
        }
        const created = await dependencies.upsertTest(jobId, questions, passingScore, isActive);
        return created;
    }
    static async getTestForJob(jobId, requesterRole, dependencies) {
        const test = await dependencies.getTestByJobId(jobId);
        if (!test)
            throw { status: 404, message: "Test not found" };
        // Hide answers for non-admins
        const hideAnswers = requesterRole !== prisma_1.UserRole.ADMIN;
        return {
            id: test.id,
            jobId: test.jobId,
            isActive: test.isActive,
            passingScore: test.passingScore,
            createdAt: test.createdAt,
            questions: test.questions.map((q) => {
                // Ensure options is always an array
                let options = [];
                if (Array.isArray(q.options)) {
                    options = q.options;
                }
                else if (typeof q.options === 'string') {
                    try {
                        options = JSON.parse(q.options);
                    }
                    catch {
                        options = [];
                    }
                }
                else if (q.options && typeof q.options === 'object') {
                    // Handle Prisma Json type
                    options = q.options;
                }
                return {
                    id: q.id,
                    question: q.question,
                    options,
                    ...(hideAnswers ? {} : { answer: q.answer }),
                };
            }),
        };
    }
    static async statusForUser(params, dependencies) {
        const { jobId, userId } = params;
        const test = await dependencies.getTestByJobId(jobId);
        if (!test || !test.isActive) {
            return { required: false };
        }
        const result = await dependencies.getResult(userId, test.id);
        const submitted = !!result;
        const score = result?.score ?? null;
        const passingScore = test.passingScore ?? null;
        const isPassed = submitted ? (passingScore != null ? (score >= passingScore) : true) : false;
        return {
            required: true,
            testId: test.id,
            submitted,
            score,
            passingScore,
            isPassed,
        };
    }
    static async deleteTestByJobId(params, dependencies) {
        const { jobId, requesterId, requesterRole } = params;
        dependencies.validateAdminAccess(requesterRole);
        await dependencies.validateJobOwnership(jobId, requesterId);
        // Import PreselectionRepository here to avoid circular dependency
        const { PreselectionRepository } = await Promise.resolve().then(() => __importStar(require("../../repositories/preselection/preselection.repository")));
        await PreselectionRepository.deleteTestByJobId(jobId);
        return { success: true };
    }
}
exports.PreselectionTestService = PreselectionTestService;
