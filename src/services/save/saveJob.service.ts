import { SavedJobRepo } from "../../repositories/save/saveJob.repositody";

export class SavedJobService {
  public static async saveJob(userId: number, jobId: string) {
    return SavedJobRepo.saveJob(userId, jobId);
  }

  public static async getSavedJobsByUser(userId: number) {
    return SavedJobRepo.getSavedJobsByUser(userId);
  }

  public static async unsaveJob(userId: number, jobId: string) {
    return SavedJobRepo.unsaveJob(userId, jobId);
  }
}
