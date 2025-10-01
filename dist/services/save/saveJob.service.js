"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SavedJobService = void 0;
const saveJob_repositody_1 = require("../../repositories/save/saveJob.repositody");
class SavedJobService {
    static async saveJob(userId, jobId) {
        return saveJob_repositody_1.SavedJobRepo.saveJob(userId, jobId);
    }
    static async getSavedJobsByUser(userId) {
        return saveJob_repositody_1.SavedJobRepo.getSavedJobsByUser(userId);
    }
    static async unsaveJob(userId, jobId) {
        return saveJob_repositody_1.SavedJobRepo.unsaveJob(userId, jobId);
    }
}
exports.SavedJobService = SavedJobService;
//# sourceMappingURL=saveJob.service.js.map