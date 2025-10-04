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
const prisma_1 = require("../../../config/prisma");
const pdf_service_1 = require("../pdf/pdf.service");
const cv_repository_1 = require("../../../repositories/cv/cv.repository");
class CVService {
    // Generate CV from user profile
    async generateCV(userId, templateType = "ats", additionalInfo) {
        try {
            // Get user data with related information
            const user = await prisma_1.prisma.user.findUnique({
                where: { id: userId },
                include: {
                    employments: {
                        include: {
                            company: true,
                        },
                        orderBy: {
                            startDate: "desc",
                        },
                    },
                    skillResults: {
                        where: { isPassed: true },
                        include: {
                            assessment: true,
                        },
                    },
                    userBadges: {
                        include: {
                            badgeTemplate: true,
                            badge: true,
                        },
                    },
                },
            });
            if (!user) {
                throw new Error("User not found");
            }
            // Prepare CV data
            const cvData = {
                personalInfo: {
                    name: user.name || "User",
                    email: user.email,
                    phone: user.phone,
                    address: user.address,
                    profilePicture: user.profilePicture,
                },
                education: user.education,
                employments: user.employments.map((emp) => ({
                    company: emp.company?.name || "Unknown Company",
                    startDate: emp.startDate,
                    endDate: emp.endDate,
                    position: "Employee", // You might want to add position field to Employment model
                })),
                skills: user.skillResults.map((result) => result.assessment.title),
                badges: user.userBadges.map((badge) => ({
                    name: badge.badgeTemplate?.name || badge.badge?.name || "Badge",
                    icon: badge.badgeTemplate?.icon || badge.badge?.icon || "🏆",
                    awardedAt: badge.earnedAt,
                })),
                additionalInfo,
            };
            // Generate PDF and upload to Cloudinary
            const pdfService = new pdf_service_1.PDFService();
            const fileUrl = await pdfService.generatePDF(cvData, templateType);
            if (!fileUrl) {
                throw new Error("Failed to generate and upload CV");
            }
            // Save to database using repository
            const generatedCV = await cv_repository_1.CVRepo.create({
                userId,
                fileUrl,
                templateUsed: templateType,
                additionalInfo,
            });
            return {
                id: generatedCV.id,
                fileUrl: generatedCV.fileUrl,
                templateUsed: generatedCV.templateUsed,
                createdAt: generatedCV.createdAt,
            };
        }
        catch (error) {
            console.error("Generate CV error:", error);
            throw error;
        }
    }
    // Update existing CV
    async updateCV(cvId, userId, templateType = "ats", additionalInfo) {
        try {
            // Check if CV exists and belongs to user
            const existingCV = await cv_repository_1.CVRepo.findByIdAndUserId(cvId, userId);
            if (!existingCV) {
                throw new Error("CV not found or access denied");
            }
            // Get user data with related information
            const user = await prisma_1.prisma.user.findUnique({
                where: { id: userId },
                include: {
                    employments: {
                        include: {
                            company: true,
                        },
                        orderBy: {
                            startDate: "desc",
                        },
                    },
                    skillResults: {
                        where: { isPassed: true },
                        include: {
                            assessment: true,
                        },
                    },
                    userBadges: {
                        include: {
                            badgeTemplate: true,
                            badge: true,
                        },
                    },
                },
            });
            if (!user) {
                throw new Error("User not found");
            }
            // Prepare updated CV data
            const cvData = {
                personalInfo: {
                    name: user.name || "User",
                    email: user.email,
                    phone: user.phone,
                    address: user.address,
                    profilePicture: user.profilePicture,
                },
                education: user.education,
                employments: user.employments.map((emp) => ({
                    company: emp.company?.name || "Unknown Company",
                    startDate: emp.startDate,
                    endDate: emp.endDate,
                    position: "Employee",
                })),
                skills: user.skillResults.map((result) => result.assessment.title),
                badges: user.userBadges.map((badge) => ({
                    name: badge.badgeTemplate?.name || badge.badge?.name || "Badge",
                    icon: badge.badgeTemplate?.icon || badge.badge?.icon || "🏆",
                    awardedAt: badge.earnedAt,
                })),
                additionalInfo,
            };
            // Generate new PDF with updated data
            const pdfService = new pdf_service_1.PDFService();
            const fileUrl = await pdfService.generatePDF(cvData, templateType);
            if (!fileUrl) {
                throw new Error("Failed to generate updated CV");
            }
            // Update CV record in database
            const updatedCV = await cv_repository_1.CVRepo.updateById(cvId, {
                fileUrl,
                templateUsed: templateType,
                additionalInfo,
            });
            return {
                id: updatedCV.id,
                fileUrl: updatedCV.fileUrl,
                templateUsed: updatedCV.templateUsed,
                createdAt: updatedCV.createdAt,
            };
        }
        catch (error) {
            console.error("Update CV error:", error);
            throw error;
        }
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
        const { cvManagementService } = require("./cv.management.service");
        return cvManagementService.getAvailableTemplates();
    }
}
exports.cvService = new CVService();
//# sourceMappingURL=cv.service.js.map