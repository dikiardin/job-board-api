"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CVDataService = void 0;
const prisma_1 = require("../../../config/prisma");
class CVDataService {
    // Get user data for CV generation
    static async getUserData(userId) {
        return await prisma_1.prisma.user.findUnique({
            where: { id: userId },
            include: {
                employments: {
                    include: {
                        company: true,
                    },
                },
            },
        });
    }
    // Transform user data to CV data format
    static transformUserDataToCVData(user, additionalInfo) {
        if (!user) {
            throw new Error("User not found");
        }
        // Use additionalInfo as primary source, fallback to user data
        return {
            personalInfo: {
                name: additionalInfo?.fullName || user.name || user.email,
                email: additionalInfo?.email || user.email,
                phone: additionalInfo?.phone || user.phone,
                address: additionalInfo?.address || user.address,
                profilePicture: user.profilePicture,
                linkedin: additionalInfo?.linkedin,
                portfolio: additionalInfo?.portfolio,
            },
            education: additionalInfo?.educationDetails || user.education || [],
            employments: additionalInfo?.workExperience || user.employments?.map((emp) => ({
                company: emp.company?.name || emp.company,
                startDate: emp.startDate,
                endDate: emp.endDate,
                position: emp.position,
            })) || [],
            skills: additionalInfo?.skills || [],
            projects: additionalInfo?.projects || [],
            certifications: additionalInfo?.certifications || [],
            languages: additionalInfo?.languages || [],
            skillCategories: additionalInfo?.skillCategories || {},
            objective: additionalInfo?.objective,
            badges: [],
            additionalInfo,
        };
    }
    // Merge additional info with existing CV data
    static mergeAdditionalInfo(cvData, additionalInfo) {
        if (!additionalInfo)
            return cvData;
        return {
            ...cvData,
            additionalInfo: {
                ...cvData.additionalInfo,
                ...additionalInfo,
            },
        };
    }
}
exports.CVDataService = CVDataService;
//# sourceMappingURL=cv.data.service.js.map