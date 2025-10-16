"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CertificateValidationService = void 0;
const customError_1 = require("../../../utils/customError");
class CertificateValidationService {
    static validateCertificateCode(certificateCode) {
        if (!certificateCode) {
            throw new customError_1.CustomError("Certificate code is required", 400);
        }
    }
    static validateUserId(userId) {
        if (!userId || userId <= 0) {
            throw new customError_1.CustomError("Valid user ID is required", 400);
        }
    }
    static validateBulkCertificates(certificateCodes) {
        if (certificateCodes.length > 50) {
            throw new customError_1.CustomError("Cannot verify more than 50 certificates at once", 400);
        }
    }
    static validateOwnership(certificateUserId, requestUserId) {
        if (certificateUserId !== requestUserId) {
            throw new customError_1.CustomError("You can only access your own certificates", 403);
        }
    }
    static validatePlatform(platform) {
        const validPlatforms = ['linkedin', 'facebook', 'twitter', 'whatsapp'];
        if (!validPlatforms.includes(platform.toLowerCase())) {
            throw new customError_1.CustomError("Invalid social media platform", 400);
        }
    }
}
exports.CertificateValidationService = CertificateValidationService;
