"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PreselectionService = void 0;
const preselection_repository_1 = require("../../repositories/preselection/preselection.repository");
const validation_service_1 = require("./validation.service");
const test_service_1 = require("./test.service");
const result_service_1 = require("./result.service");
class PreselectionService {
    static async createOrUpdateTest(params) {
        const validationDeps = {
            validateAdminAccess: this.dependencies.validateAdminAccess,
            validateJobOwnership: (jobId, requesterId) => validation_service_1.PreselectionValidationService.validateJobOwnership(jobId, requesterId, this.dependencies.getJob),
            validateQuestions: this.dependencies.validateQuestions,
            validatePassingScore: this.dependencies.validatePassingScore,
            upsertTest: this.dependencies.upsertTest,
        };
        return test_service_1.PreselectionTestService.createOrUpdateTest(params, validationDeps);
    }
    static async getTestForJob(jobId, requesterRole) {
        const testDeps = {
            getTestByJobId: this.dependencies.getTestByJobId,
        };
        return test_service_1.PreselectionTestService.getTestForJob(jobId, requesterRole, testDeps);
    }
    static async submitAnswers(params) {
        const resultDeps = {
            validateSubmissionAccess: this.dependencies.validateSubmissionAccess,
            getTestById: this.dependencies.getTestById,
            validateTestForSubmission: this.dependencies.validateTestForSubmission,
            getResult: this.dependencies.getResult,
            validateAnswers: this.dependencies.validateAnswers,
            validateAnswerOption: this.dependencies.validateAnswerOption,
            createResult: this.dependencies.createResult,
        };
        return result_service_1.PreselectionResultService.submitAnswers(params, resultDeps);
    }
    static async getJobResults(params) {
        const resultDeps = {
            validateAdminAccess: this.dependencies.validateAdminAccess,
            validateJobOwnership: (jobId, requesterId) => validation_service_1.PreselectionValidationService.validateJobOwnership(jobId, requesterId, this.dependencies.getJob),
            getTestResultsByJob: this.dependencies.getTestResultsByJob,
        };
        return result_service_1.PreselectionResultService.getJobResults(params, resultDeps);
    }
    static async statusForUser(params) {
        const testDeps = {
            getTestByJobId: this.dependencies.getTestByJobId,
            getResult: this.dependencies.getResult,
        };
        return test_service_1.PreselectionTestService.statusForUser(params, testDeps);
    }
}
exports.PreselectionService = PreselectionService;
PreselectionService.dependencies = {
    validateAdminAccess: validation_service_1.PreselectionValidationService.validateAdminAccess,
    validateJobOwnership: validation_service_1.PreselectionValidationService.validateJobOwnership,
    validateQuestions: validation_service_1.PreselectionValidationService.validateQuestions,
    validatePassingScore: validation_service_1.PreselectionValidationService.validatePassingScore,
    validateSubmissionAccess: validation_service_1.PreselectionValidationService.validateSubmissionAccess,
    validateTestForSubmission: validation_service_1.PreselectionValidationService.validateTestForSubmission,
    validateAnswers: validation_service_1.PreselectionValidationService.validateAnswers,
    validateAnswerOption: validation_service_1.PreselectionValidationService.validateAnswerOption,
    getJob: preselection_repository_1.PreselectionRepository.getJob,
    getTestByJobId: preselection_repository_1.PreselectionRepository.getTestByJobId,
    getTestById: preselection_repository_1.PreselectionRepository.getTestById,
    getResult: preselection_repository_1.PreselectionRepository.getResult,
    getTestResultsByJob: preselection_repository_1.PreselectionRepository.getTestResultsByJob,
    upsertTest: preselection_repository_1.PreselectionRepository.upsertTest,
    createResult: preselection_repository_1.PreselectionRepository.createResult,
};
//# sourceMappingURL=preselection.service.js.map