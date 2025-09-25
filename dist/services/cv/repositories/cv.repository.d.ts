import { GeneratedCV } from '../../../generated/prisma';
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
        name: string;
        email: string;
        phone: string | null;
        address: string | null;
        profilePicture: string | null;
    };
}
export declare class CVRepository {
    create(data: CVCreateData): Promise<GeneratedCV>;
    findById(id: number): Promise<GeneratedCV | null>;
    findByIdWithUser(id: number): Promise<CVWithUser | null>;
    findByIdAndUserId(id: number, userId: number): Promise<GeneratedCV | null>;
    findByUserId(userId: number): Promise<Partial<GeneratedCV>[]>;
    findByUserIdWithDetails(userId: number): Promise<GeneratedCV[]>;
    updateById(id: number, data: CVUpdateData): Promise<GeneratedCV>;
    deleteById(id: number): Promise<GeneratedCV>;
    deleteByIdAndUserId(id: number, userId: number): Promise<GeneratedCV | null>;
    countByUserId(userId: number): Promise<number>;
    countByUserIdThisMonth(userId: number): Promise<number>;
    findByTemplateType(templateType: string): Promise<GeneratedCV[]>;
    findRecent(limit?: number): Promise<GeneratedCV[]>;
    getStatistics(): Promise<{
        totalCVs: number;
        totalUsers: number;
        templateStats: {
            templateUsed: string;
            count: number;
        }[];
        monthlyStats: {
            month: string;
            count: number;
        }[];
    }>;
    exists(id: number): Promise<boolean>;
    isOwner(cvId: number, userId: number): Promise<boolean>;
}
export declare const cvRepository: CVRepository;
//# sourceMappingURL=cv.repository.d.ts.map