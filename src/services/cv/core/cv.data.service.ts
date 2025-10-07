import { prisma } from "../../../config/prisma";
import { CVData, CVAdditionalInfo } from "./cv.types";

export class CVDataService {
  // Get user data for CV generation
  static async getUserData(userId: number): Promise<any> {
    return await prisma.user.findUnique({
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
  static transformUserDataToCVData(user: any, additionalInfo?: CVAdditionalInfo): CVData {
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
      employments: additionalInfo?.workExperience || user.employments?.map((emp: any) => ({
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
  static mergeAdditionalInfo(cvData: CVData, additionalInfo?: CVAdditionalInfo): CVData {
    if (!additionalInfo) return cvData;

    return {
      ...cvData,
      additionalInfo: {
        ...cvData.additionalInfo,
        ...additionalInfo,
      },
    };
  }
}
