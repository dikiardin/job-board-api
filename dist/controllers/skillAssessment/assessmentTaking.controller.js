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
exports.AssessmentTakingController = void 0;
const assessmentSubmission_service_1 = require("../../services/skillAssessment/assessmentSubmission.service");
const assessmentResults_service_1 = require("../../services/skillAssessment/assessmentResults.service");
const controllerHelper_1 = require("../../utils/controllerHelper");
class AssessmentTakingController {
    static async getAssessmentForUserBySlug(req, res, next) {
        try {
            const userId = controllerHelper_1.ControllerHelper.getUserId(res);
            const slug = req.params.slug;
            const { SkillAssessmentModularRepository } = await Promise.resolve().then(() => __importStar(require("../../repositories/skillAssessment/skillAssessmentModular.repository")));
            let assessment = await SkillAssessmentModularRepository.getAssessmentBySlug(slug);
            if (!assessment) {
                const numericId = parseInt(slug, 10);
                if (!isNaN(numericId)) {
                    assessment = await SkillAssessmentModularRepository.getAssessmentById(numericId);
                }
            }
            if (!assessment) {
                throw new Error(`Assessment with slug ${slug} not found`);
            }
            const assessmentId = assessment.id;
            const { AssessmentSubmissionService } = await Promise.resolve().then(() => __importStar(require("../../services/skillAssessment/assessmentSubmission.service")));
            const assessmentForUser = await AssessmentSubmissionService.getAssessmentForTaking(assessmentId);
            res.status(200).json({
                success: true,
                message: "Assessment retrieved successfully",
                data: assessmentForUser,
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async getAssessmentForUser(req, res, next) {
        try {
            const userId = controllerHelper_1.ControllerHelper.getUserId(res);
            const assessmentId = controllerHelper_1.ControllerHelper.parseId(req.params.assessmentId);
            // Check if assessment exists first
            const assessmentExists = await assessmentSubmission_service_1.AssessmentSubmissionService.checkAssessmentExists(assessmentId);
            if (!assessmentExists) {
                throw new Error(`Assessment with ID ${assessmentId} not found`);
            }
            // Get assessment for user (without answers)
            const assessment = await assessmentSubmission_service_1.AssessmentSubmissionService.getAssessmentForTaking(assessmentId);
            res.status(200).json({
                success: true,
                message: "Assessment retrieved successfully",
                data: assessment,
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async submitAssessment(req, res, next) {
        try {
            const userId = controllerHelper_1.ControllerHelper.getUserId(res);
            const assessmentId = controllerHelper_1.ControllerHelper.parseId(req.params.assessmentId);
            const { answers, startedAt } = req.body;
            const result = await assessmentSubmission_service_1.AssessmentSubmissionService.submitAssessment({
                userId,
                assessmentId,
                answers,
                startedAt,
            });
            res.status(200).json({
                success: true,
                message: "Assessment submitted successfully",
                data: result,
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async getUserResults(req, res, next) {
        try {
            const userId = controllerHelper_1.ControllerHelper.getUserId(res);
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const results = await assessmentResults_service_1.AssessmentResultsService.getUserResults(userId, page, limit);
            res.status(200).json({
                success: true,
                message: "User results retrieved successfully",
                data: results,
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async getAssessmentResults(req, res, next) {
        try {
            const { userId, role } = res.locals.decrypt;
            const assessmentId = controllerHelper_1.ControllerHelper.parseId(req.params.assessmentId);
            // For developers, get all results for the assessment
            // For users, get only their specific result
            const results = role === "DEVELOPER"
                ? await assessmentSubmission_service_1.AssessmentSubmissionService.getAllAssessmentResults(assessmentId, userId)
                : await assessmentSubmission_service_1.AssessmentSubmissionService.getAssessmentResult(userId, assessmentId);
            res.status(200).json({
                success: true,
                message: "Assessment results retrieved successfully",
                data: results,
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async getUserAssessmentAttempts(req, res, next) {
        try {
            const userId = controllerHelper_1.ControllerHelper.getUserId(res);
            const assessmentId = controllerHelper_1.ControllerHelper.parseId(req.params.assessmentId);
            const attempts = await assessmentSubmission_service_1.AssessmentSubmissionService.getUserAssessmentAttempts(userId, assessmentId);
            res.status(200).json({
                success: true,
                message: "User assessment attempts retrieved successfully",
                data: attempts,
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.AssessmentTakingController = AssessmentTakingController;
//# sourceMappingURL=assessmentTaking.controller.js.map