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

    return {
      personalInfo: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        profilePicture: user.profilePicture,
      },
      education: user.education,
      employments: user.employments.map((emp: any) => ({
        company: emp.company.name,
        startDate: emp.startDate,
        endDate: emp.endDate,
        position: emp.position,
      })),
      skills: [],
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
