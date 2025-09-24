import { prisma } from '../../config/prisma';
import { deleteFromCloudinary } from '../../utils/uploadBuffer';

export class CVManagementService {
  // Get user's generated CVs
  async getUserCVs(userId: number) {
    return await prisma.generatedCV.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        fileUrl: true,
        templateUsed: true,
        createdAt: true,
      }
    });
  }

  // Get specific CV by ID
  async getCVById(cvId: number, userId: number): Promise<any> {
    const cv = await prisma.generatedCV.findFirst({
      where: {
        id: cvId,
        userId: userId
      }
    });
    
    if (cv) {
      // Create API-based download URLs
      const apiDownloadUrl = `/cv/${cv.id}/download`;                    // Auth required
      const publicDownloadUrl = `/cv/public/${cv.id}/CV_${cv.id}.pdf`;   // No auth required
      const publicDownloadDefault = `/cv/public/${cv.id}`;               // Default filename
      
      return {
        ...cv,
        downloadUrl: apiDownloadUrl,        // API endpoint (auth required)
        publicUrl: publicDownloadUrl,       // Public download URL (no auth)
        publicUrlDefault: publicDownloadDefault, // Public URL with default filename
        originalUrl: cv.fileUrl             // Original Cloudinary URL
      };
    }
    
    return cv;
  }

  // Delete CV
  async deleteCV(cvId: number, userId: number) {
    const cv = await prisma.generatedCV.findFirst({
      where: {
        id: cvId,
        userId
      }
    });

    if (!cv) {
      throw new Error('CV not found');
    }

    // Delete from Cloudinary
    try {
      await deleteFromCloudinary(cv.fileUrl);
    } catch (error) {
      console.error('Failed to delete from Cloudinary:', error);
      // Continue with database deletion even if Cloudinary deletion fails
    }

    // Delete from database
    await prisma.generatedCV.delete({
      where: { id: cvId }
    });

    return { message: 'CV deleted successfully' };
  }

  // Get available CV templates
  getAvailableTemplates() {
    return [
      {
        id: 'ats',
        name: 'ATS-Friendly Template',
        description: 'Clean, professional template optimized for Applicant Tracking Systems',
        preview: '/templates/ats-preview.png'
      },
      {
        id: 'modern',
        name: 'Modern Template',
        description: 'Contemporary design with visual elements and modern typography',
        preview: '/templates/modern-preview.png'
      },
      {
        id: 'creative',
        name: 'Creative Template',
        description: 'Unique design for creative professionals with visual flair',
        preview: '/templates/creative-preview.png'
      }
    ];
  }
}

export const cvManagementService = new CVManagementService();
