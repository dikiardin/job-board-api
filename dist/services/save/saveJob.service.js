"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SavedJobService = void 0;
const saveJob_repository_1 = require("../../repositories/save/saveJob.repository");
class SavedJobService {
    static async saveJob(userId, jobId) {
        return saveJob_repository_1.SavedJobRepo.saveJob(userId, jobId);
    }
    static async getSavedJobsByUser(userId, page, limit) {
        return saveJob_repository_1.SavedJobRepo.getSavedJobsByUser(userId, page, limit);
    }
    static async unsaveJob(userId, jobId) {
        return saveJob_repository_1.SavedJobRepo.unsaveJob(userId, jobId);
    }
}
exports.SavedJobService = SavedJobService;
//# sourceMappingURL=saveJob.service.js.map