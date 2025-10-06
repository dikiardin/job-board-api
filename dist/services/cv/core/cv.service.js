"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.cvService = void 0;
const cv_generation_service_1 = require("./cv.generation.service");
class CVService {
    // Generate CV from user profile
    async generateCV(userId, templateType = "ats", additionalInfo) {
        return await cv_generation_service_1.CVGenerationService.generateCV(userId, templateType, additionalInfo);
    }
    // Update existing CV
    async updateCV(cvId, userId, templateType = "ats", additionalInfo) {
        return await cv_generation_service_1.CVGenerationService.updateCV(cvId, userId, templateType, additionalInfo);
    }
    // Delegate to management service
    async getUserCVs(userId) {
        const { cvManagementService } = await Promise.resolve().then(() => __importStar(require("./cv.management.service")));
        return cvManagementService.getUserCVs(userId);
    }
    async getCVById(cvId, userId) {
        const { cvManagementService } = await Promise.resolve().then(() => __importStar(require("./cv.management.service")));
        return cvManagementService.getCVById(cvId, userId);
    }
    async deleteCV(cvId, userId) {
        const { cvManagementService } = await Promise.resolve().then(() => __importStar(require("./cv.management.service")));
        return cvManagementService.deleteCV(cvId, userId);
    }
    getAvailableTemplates() {
        return [
            {
                id: "ats",
                name: "ATS Friendly",
                description: "Optimized for Applicant Tracking Systems",
                isATS: true,
            },
            {
                id: "modern",
                name: "Modern Design",
                description: "Clean and contemporary layout",
                isATS: false,
            },
            {
                id: "creative",
                name: "Creative",
                description: "Eye-catching design for creative roles",
                isATS: false,
            },
        ];
    }
}
exports.cvService = new CVService();
//# sourceMappingURL=cv.service.js.map