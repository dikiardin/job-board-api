import { prisma } from "../../config/prisma";
import { GeneratedCV, Prisma } from "../../generated/prisma";

export interface CVCreateData {
  userId: number;
  fileUrl: string;
  templateUsed: string;
  additionalInfo?: any;
}

export interface CVUpdateData {
  fileUrl?: string;
  templateUsed?: string;
  additionalInfo?: any;
}

export interface CVWithUser extends GeneratedCV {
  user?: {
    id: number;
    name: string | null;
    email: string;
    phone: string | null;
    address: string | null;
    profilePicture: string | null;
  };
}


export class CVRepo {
  // Create new CV record
  public static async create(data: CVCreateData): Promise<GeneratedCV> {
    return await prisma.generatedCV.create({
      data: {
        userId: data.userId,
        fileUrl: data.fileUrl,
        templateUsed: data.templateUsed,
        additionalInfo: data.additionalInfo as Prisma.InputJsonValue,
      },
    });
  }

  // Find CV by ID
  public static async findById(id: number): Promise<GeneratedCV | null> {
    return await prisma.generatedCV.findUnique({
      where: { id },
    });
  }

  // Find CV by ID with user data
  public static async findByIdWithUser(id: number): Promise<CVWithUser | null> {
    return await prisma.generatedCV.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            address: true,
            profilePicture: true,
          },
        },
      },
    });
  }

  // Find CV by ID and user ID (for security)
  public static async findByIdAndUserId(id: number, userId: number): Promise<GeneratedCV | null> {
    return await prisma.generatedCV.findFirst({
      where: {
        id,
        userId,
      },
    });
  }

  // Find all CVs by user ID
  public static async findByUserId(userId: number): Promise<Partial<GeneratedCV>[]> {
    return await prisma.generatedCV.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        fileUrl: true,
        templateUsed: true,
        createdAt: true,
      },
    });
  }

  // Find all CVs by user ID with full data
  public static async findByUserIdWithDetails(userId: number): Promise<GeneratedCV[]> {
    return await prisma.generatedCV.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Update CV by ID
  public static async updateById(id: number, data: CVUpdateData): Promise<GeneratedCV> {
    return await prisma.generatedCV.update({
      where: { id },
      data: {
        ...(data.fileUrl && { fileUrl: data.fileUrl }),
        ...(data.templateUsed && { templateUsed: data.templateUsed }),
        ...(data.additionalInfo && { additionalInfo: data.additionalInfo as Prisma.InputJsonValue }),
      },
    });
  }

  // Delete CV by ID
  public static async deleteById(id: number): Promise<GeneratedCV> {
    return await prisma.generatedCV.delete({
      where: { id },
    });
  }

  // Delete CV by ID and user ID (for security)
  public static async deleteByIdAndUserId(id: number, userId: number): Promise<GeneratedCV | null> {
    const cv = await CVRepo.findByIdAndUserId(id, userId);
    if (!cv) {
      return null;
    }

    return await prisma.generatedCV.delete({
      where: { id },
    });
  }

  // Count CVs by user ID
  public static async countByUserId(userId: number): Promise<number> {
    return await prisma.generatedCV.count({
      where: { userId },
    });
  }

  // Count CVs by user ID in current month (for subscription limits)
  public static async countByUserIdThisMonth(userId: number): Promise<number> {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    return await prisma.generatedCV.count({
      where: {
        userId,
        createdAt: {
          gte: startOfMonth,
        },
      },
    });
  }

  // Find CVs by template type
  public static async findByTemplateType(templateType: string): Promise<GeneratedCV[]> {
    return await prisma.generatedCV.findMany({
      where: { templateUsed: templateType },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Find recent CVs (for analytics)
  public static async findRecent(limit: number = 10): Promise<GeneratedCV[]> {
    return await prisma.generatedCV.findMany({
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }


  // Check if CV exists
  public static async exists(id: number): Promise<boolean> {
    const cv = await prisma.generatedCV.findUnique({
      where: { id },
      select: { id: true },
    });
    return !!cv;
  }

  // Check if user owns CV
  public static async isOwner(cvId: number, userId: number): Promise<boolean> {
    const cv = await prisma.generatedCV.findFirst({
      where: {
        id: cvId,
        userId,
      },
      select: { id: true },
    });
    return !!cv;
  }
}
