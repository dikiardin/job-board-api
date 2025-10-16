"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CertificateHelper = void 0;
const customError_1 = require("../../../utils/customError");
class CertificateHelper {
    static validateCertificateCode(code) {
        if (!code) {
            throw new customError_1.CustomError("Certificate code is required", 400);
        }
    }
    static validateUserId(userId) {
        if (!userId || userId <= 0) {
            throw new customError_1.CustomError("Valid user ID is required", 400);
        }
    }
    static validateAssessmentResultId(resultId) {
        const id = parseInt(resultId);
        if (isNaN(id) || id <= 0) {
            throw new customError_1.CustomError("Valid assessment result ID is required", 400);
        }
        return id;
    }
    static buildSuccessResponse(message, data) {
        return {
            success: true,
            message,
            ...(data && { data })
        };
    }
}
exports.CertificateHelper = CertificateHelper;
