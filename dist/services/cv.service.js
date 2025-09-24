"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cvService = void 0;
const prisma_1 = require("../config/prisma");
const pdf_service_1 = require("./pdf.service");
const uploadBuffer_1 = require("../utils/uploadBuffer");
class CVService {
    // Get available CV templates
    getAvailableTemplates() {
        return [
            {
                id: 'ats',
                name: 'ATS Friendly',
                description: 'Simple, clean format optimized for Applicant Tracking Systems',
                isATS: true
            },
            {
                id: 'modern',
                name: 'Modern Professional',
                description: 'Contemporary design with subtle styling',
                isATS: true
            },
            {
                id: 'creative',
                name: 'Creative',
                description: 'Eye-catching design for creative professionals',
                isATS: false
            }
        ];
    }
    // Generate CV from user profile
    async generateCV(userId, templateType = 'ats', additionalInfo) {
        try {
            // Get user data with related information
            const user = await prisma_1.prisma.user.findUnique({
                where: { id: userId },
                include: {
                    employments: {
                        include: {
                            company: true
                        },
                        orderBy: {
                            startDate: 'desc'
                        }
                    },
                    skillResults: {
                        where: { isPassed: true },
                        include: {
                            assessment: true
                        }
                    },
                    userBadges: true
                }
            });
            if (!user) {
                throw new Error('User not found');
            }
            // Prepare CV data
            const cvData = {
                personalInfo: {
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                    address: user.address,
                    profilePicture: user.profilePicture
                },
                education: user.education,
                employments: user.employments.map(emp => ({
                    company: emp.company?.name || 'Unknown Company',
                    startDate: emp.startDate,
                    endDate: emp.endDate,
                    position: 'Employee' // You might want to add position field to Employment model
                })),
                skills: user.skillResults.map(result => result.assessment.title),
                badges: user.userBadges.map(badge => ({
                    name: badge.badgeName,
                    icon: badge.badgeIcon,
                    awardedAt: badge.awardedAt
                })),
                additionalInfo
            };
            // Generate PDF
            const pdfBuffer = await pdf_service_1.pdfService.generateCVPDF(cvData, templateType);
            // Upload to Cloudinary
            const uploadResult = await (0, uploadBuffer_1.uploadBufferToCloudinary)(pdfBuffer, {
                folder: 'cv-files',
                resourceType: 'raw'
            });
            if (!uploadResult) {
                throw new Error('Failed to upload CV to cloud storage');
            }
            // Save to database
            const generatedCV = await prisma_1.prisma.generatedCV.create({
                data: {
                    userId,
                    fileUrl: uploadResult.secureUrl,
                    templateUsed: templateType,
                    additionalInfo: additionalInfo
                }
            });
            return {
                id: generatedCV.id,
                fileUrl: generatedCV.fileUrl,
                templateUsed: generatedCV.templateUsed,
                createdAt: generatedCV.createdAt
            };
        }
        catch (error) {
            console.error('Generate CV error:', error);
            throw error;
        }
    }
    // Get user's generated CVs
    async getUserCVs(userId) {
        return await prisma_1.prisma.generatedCV.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                fileUrl: true,
                templateUsed: true,
                createdAt: true
            }
        });
    }
    // Get specific CV by ID
    async getCVById(cvId, userId) {
        return await prisma_1.prisma.generatedCV.findFirst({
            where: {
                id: cvId,
                userId
            }
        });
    }
    // Delete CV
    async deleteCV(cvId, userId) {
        const cv = await prisma_1.prisma.generatedCV.findFirst({
            where: {
                id: cvId,
                userId
            }
        });
        if (!cv) {
            throw new Error('CV not found');
        }
        // Delete from database
        await prisma_1.prisma.generatedCV.delete({
            where: { id: cvId }
        });
        // Note: You might want to also delete from Cloudinary here
        // using deleteFromCloudinary function from uploadBuffer.ts
    }
}
exports.cvService = new CVService();
//# sourceMappingURL=cv.service.js.map