"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobShareService = void 0;
const shareJob_repository_1 = require("../../repositories/share/shareJob.repository");
class JobShareService {
    static async shareJob(userId, jobId, platform, sharedUrl, customMessage) {
        return shareJob_repository_1.JobShareRepo.createShare(userId, jobId, platform, sharedUrl, customMessage);
    }
    static async getSharesByJob(jobId) {
        return shareJob_repository_1.JobShareRepo.findSharesByJob(jobId);
    }
}
exports.JobShareService = JobShareService;
