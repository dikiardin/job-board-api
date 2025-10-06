import { CustomError } from "../../../utils/customError";

export class CertificateHelper {
  public static validateCertificateCode(code: string): void {
    if (!code) {
      throw new CustomError("Certificate code is required", 400);
    }
  }

  public static validateUserId(userId: number): void {
    if (!userId || userId <= 0) {
      throw new CustomError("Valid user ID is required", 400);
    }
  }

  public static validateAssessmentResultId(resultId: string): number {
    const id = parseInt(resultId);
    if (isNaN(id) || id <= 0) {
      throw new CustomError("Valid assessment result ID is required", 400);
    }
    return id;
  }

  public static buildSuccessResponse(message: string, data?: any) {
    return {
      success: true,
      message,
      ...(data && { data })
    };
  }
}
