import { SavedJobRepo } from "../../repositories/save/saveJob.repository";

export class SavedJobService {
  public static async saveJob(userId: number, jobId: string) {
    return SavedJobRepo.saveJob(userId, jobId);
  }

  public static async getSavedJobsByUser(
    userId: number,
    page: number,
    limit: number
  ) {
    return SavedJobRepo.getSavedJobsByUser(userId, page, limit);
  }

  public static async unsaveJob(userId: number, jobId: string) {
    return SavedJobRepo.unsaveJob(userId, jobId);
  }
}
