import { CreateEmploymentRepo } from "../../repositories/employment/createEmployment.repository";

export class CreateEmploymentService {
  public static async createForNewUser(userId: number) {
    return CreateEmploymentRepo.createEmploymentForUser(userId);
  }
}
