"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SavedJobController = void 0;
const saveJob_service_1 = require("../../services/save/saveJob.service");
class SavedJobController {
    static async saveJob(req, res, next) {
        try {
            const userId = res.locals.decrypt.userId;
            const { jobId } = req.params;
            if (!jobId) {
                return res.status(400).json({ message: "Job ID is required" });
            }
            const jobIdNumber = parseInt(jobId, 10);
            if (isNaN(jobIdNumber)) {
                return res.status(400).json({ message: "Invalid job ID" });
            }
            const savedJob = await saveJob_service_1.SavedJobService.saveJob(userId, jobIdNumber);
            res.status(201).json({
                message: "Job saved successfully",
                data: savedJob,
            });
        }
        catch (err) {
            next(err);
        }
    }
    static async getSavedJobsByUser(req, res, next) {
        try {
            const { userId } = req.params;
            if (!userId) {
                return res.status(400).json({ message: "User ID is required" });
            }
            const jobs = await saveJob_service_1.SavedJobService.getSavedJobsByUser(parseInt(userId, 10));
            res.status(200).json({
                message: "Saved jobs fetched successfully",
                data: jobs,
            });
        }
        catch (err) {
            next(err);
        }
    }
    static async unsaveJob(req, res, next) {
        try {
            const userId = res.locals.decrypt.userId;
            const { jobId } = req.params;
            if (!jobId) {
                return res.status(400).json({ message: "Job ID is required" });
            }
            const jobIdNumber = parseInt(jobId, 10);
            if (isNaN(jobIdNumber)) {
                return res.status(400).json({ message: "Invalid job ID" });
            }
            await saveJob_service_1.SavedJobService.unsaveJob(userId, jobIdNumber);
            res.status(200).json({ message: "Job unsaved successfully" });
        }
        catch (err) {
            next(err);
        }
    }
}
exports.SavedJobController = SavedJobController;
//# sourceMappingURL=saveJob.controller.js.map