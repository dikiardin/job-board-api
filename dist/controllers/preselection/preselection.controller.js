"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PreselectionController = void 0;
const preselection_service_1 = require("../../services/preselection/preselection.service");
class PreselectionController {
    static async createTest(req, res, next) {
        try {
            const jobId = req.params.jobId;
            const { questions, passingScore, isActive } = req.body;
            const requester = res.locals.decrypt;
            const created = await preselection_service_1.PreselectionService.createOrUpdateTest({
                jobId,
                requesterId: requester.userId,
                requesterRole: requester.role,
                questions,
                passingScore,
                isActive,
            });
            res.status(201).json({ success: true, data: created });
        }
        catch (error) {
            next(error);
        }
    }
    static async deleteTest(req, res, next) {
        try {
            const jobId = req.params.jobId;
            const requester = res.locals.decrypt;
            await preselection_service_1.PreselectionService.deleteTestByJobId({
                jobId,
                requesterId: requester.userId,
                requesterRole: requester.role,
            });
            res.status(200).json({ success: true, message: "Preselection test deleted successfully" });
        }
        catch (error) {
            next(error);
        }
    }
    static async getTest(req, res, next) {
        try {
            const jobId = req.params.jobId;
            const requester = res.locals.decrypt;
            const data = await preselection_service_1.PreselectionService.getTestForJob(jobId, requester?.role);
            res.status(200).json({ success: true, data });
        }
        catch (error) {
            next(error);
        }
    }
    static async submit(req, res, next) {
        try {
            const pathApplicantId = Number(req.params.applicantId);
            const testId = Number(req.params.testId);
            const { answers } = req.body;
            const requester = res.locals.decrypt;
            const result = await preselection_service_1.PreselectionService.submitAnswers({
                applicantId: requester.userId,
                pathApplicantId,
                testId,
                requesterRole: requester.role,
                answers,
            });
            res.status(201).json({ success: true, data: result });
        }
        catch (error) {
            next(error);
        }
    }
    static async getJobResults(req, res, next) {
        try {
            const jobId = req.params.jobId;
            const requester = res.locals.decrypt;
            const data = await preselection_service_1.PreselectionService.getJobResults({ jobId, requesterId: requester.userId, requesterRole: requester.role });
            res.status(200).json({ success: true, data });
        }
        catch (error) {
            next(error);
        }
    }
    static async myStatus(req, res, next) {
        try {
            const jobId = req.params.jobId;
            const requester = res.locals.decrypt;
            const data = await preselection_service_1.PreselectionService.statusForUser({ jobId, userId: requester.userId });
            res.status(200).json({ success: true, data });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.PreselectionController = PreselectionController;
