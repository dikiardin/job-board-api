import { CustomError } from "../../../utils/customError";

export class CertificateValidationService {
  public static validateCertificateCode(certificateCode: string): void {
    if (!certificateCode) {
      throw new CustomError("Certificate code is required", 400);
    }
  }

  public static validateUserId(userId: number): void {
    if (!userId || userId <= 0) {
      throw new CustomError("Valid user ID is required", 400);
    }
  }

  public static validateBulkCertificates(certificateCodes: string[]): void {
    if (certificateCodes.length > 50) {
      throw new CustomError("Cannot verify more than 50 certificates at once", 400);
    }
  }

  public static validateOwnership(certificateUserId: number, requestUserId: number): void {
    if (certificateUserId !== requestUserId) {
      throw new CustomError("You can only access your own certificates", 403);
    }
  }

  public static validatePlatform(platform: string): void {
    const validPlatforms = ['linkedin', 'facebook', 'twitter', 'whatsapp'];
    if (!validPlatforms.includes(platform.toLowerCase())) {
      throw new CustomError("Invalid social media platform", 400);
    }
  }
}
