import { prisma } from '../../../config/prisma';
import { PDFService } from '../pdf/pdf.service';
import { uploadToCloudinary } from '../../../utils/uploadBuffer';
import { CVRepo } from '../../../repositories/cv/cv.repository';
import { Readable } from 'stream';

// CV Data Types
export interface CVData {
  personalInfo: {
    name: string;
    email: string;
    phone?: string | null;
    address?: string | null;
    profilePicture?: string | null;
  };
  education?: string | null;
  employments: Array<{
    company: string;
    startDate: Date | null;
    endDate: Date | null;
    position: string;
  }>;
  skills: string[];
  badges: Array<{
    name: string;
    icon?: string | null;
    awardedAt: Date;
  }>;
  additionalInfo?: CVAdditionalInfo | undefined;
}

export interface CVAdditionalInfo {
  objective?: string;
  skills?: string[];
  skillCategories?: Record<string, string[]>; // Optional custom skill categorization
  linkedin?: string; // LinkedIn profile URL
  portfolio?: string; // Portfolio website URL
  workExperience?: Array<{
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    responsibilities: string[];
  }>;
  educationDetails?: Array<{
    institution: string;
    degree: string;
    year: string;
    gpa?: string;
  }>;
  languages?: Array<{
    name: string;
    level: string;
  }>;
  certifications?: Array<{
    name: string;
    issuer: string;
    date: string;
    link?: string;
  }>;
  projects?: Array<{
    name: string;
    description: string;
    technologies: string[];
    url?: string;
  }>;
  references?: Array<{
    name: string;
    position: string;
    company: string;
    phone: string;
    email: string;
  }>;
}

export interface CVTemplate {
  id: string;
  name: string;
  description: string;
  isATS: boolean;
}

class CVService {
  // Generate CV from user profile
  async generateCV(userId: number, templateType: string = 'ats', additionalInfo?: CVAdditionalInfo) {
    try {
      // Get user data with related information
      const user = await prisma.user.findUnique({
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

      // Generate PDF and upload to Cloudinary
      const pdfService = new PDFService();
      const fileUrl = await pdfService.generatePDF(cvData, templateType);

      if (!fileUrl) {
        throw new Error('Failed to generate and upload CV');
      }

      // Save to database using repository
      const generatedCV = await CVRepo.create({
        userId,
        fileUrl,
        templateUsed: templateType,
        additionalInfo
      });

      return {
        id: generatedCV.id,
        fileUrl: generatedCV.fileUrl,
        templateUsed: generatedCV.templateUsed,
        createdAt: generatedCV.createdAt
      };
    } catch (error) {
      console.error('Generate CV error:', error);
      throw error;
    }
  }

  // Delegate to management service
  async getUserCVs(userId: number) {
    const { cvManagementService } = await import('./cv.management.service');
    return cvManagementService.getUserCVs(userId);
  }

  async getCVById(cvId: number, userId: number) {
    const { cvManagementService } = await import('./cv.management.service');
    return cvManagementService.getCVById(cvId, userId);
  }

  async deleteCV(cvId: number, userId: number) {
    const { cvManagementService } = await import('./cv.management.service');
    return cvManagementService.deleteCV(cvId, userId);
  }

  getAvailableTemplates() {
    const { cvManagementService } = require('./cv.management.service');
    return cvManagementService.getAvailableTemplates();
  }
}

export const cvService = new CVService();
