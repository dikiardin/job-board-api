"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobShareController = void 0;
const jobShare_service_1 = require("../../services/share/jobShare.service");
const shareJob_repository_1 = require("../../repositories/share/shareJob.repository");
const mapping = {
    whatsapp: shareJob_repository_1.SharePlatform.WHATSAPP,
    linkedin: shareJob_repository_1.SharePlatform.LINKEDIN,
    facebook: shareJob_repository_1.SharePlatform.FACEBOOK,
    twitter: shareJob_repository_1.SharePlatform.TWITTER,
};
class JobShareController {
    static async shareJob(req, res, next) {
        try {
            const userId = res.locals.decrypt.userId;
            const { jobId } = req.params;
            const { platform, sharedUrl, customMessage } = req.body;
            if (!jobId) {
                return res.status(400).json({ message: "Job ID is required" });
            }
            if (!platform || !mapping[platform]) {
                return res.status(400).json({ message: "Invalid platform" });
            }
            const share = await jobShare_service_1.JobShareService.shareJob(userId, jobId, mapping[platform], sharedUrl ?? undefined, customMessage ?? undefined);
            res.status(201).json({
                message: "Job shared successfully",
                data: share,
            });
        }
        catch (err) {
            next(err);
        }
    }
    static async getSharesByJob(req, res, next) {
        try {
            const { jobId } = req.params;
            if (!jobId) {
                return res.status(400).json({ message: "Job ID is required" });
            }
            const shares = await jobShare_service_1.JobShareService.getSharesByJob(jobId);
            res.status(200).json({
                message: "Shares fetched successfully",
                data: shares,
            });
        }
        catch (err) {
            next(err);
        }
    }
}
exports.JobShareController = JobShareController;
