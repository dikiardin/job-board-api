import { prisma } from "../../config/prisma";

export class AssessmentCrudValidationRepository {
  // Check if assessment title is available
  public static async isAssessmentTitleAvailable(
    title: string,
    excludeId?: number
  ) {
    const where: any = { title };
    if (excludeId) where.id = { not: excludeId };

    const existing = await prisma.skillAssessment.findFirst({ where });
    return !existing;
  }
}
