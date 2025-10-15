import { GeneratedCV } from "../../generated/prisma";
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
export declare class CVRepo {
    static create(data: CVCreateData): Promise<GeneratedCV>;
    static findById(id: number): Promise<GeneratedCV | null>;
    static findByIdWithUser(id: number): Promise<CVWithUser | null>;
    static findByIdAndUserId(id: number, userId: number): Promise<GeneratedCV | null>;
    static findByUserId(userId: number): Promise<Partial<GeneratedCV>[]>;
    static findByUserIdWithDetails(userId: number): Promise<GeneratedCV[]>;
    static updateById(id: number, data: CVUpdateData): Promise<GeneratedCV>;
    static deleteById(id: number): Promise<GeneratedCV>;
    static deleteByIdAndUserId(id: number, userId: number): Promise<GeneratedCV | null>;
    static countByUserId(userId: number): Promise<number>;
    static countByUserIdThisMonth(userId: number): Promise<number>;
    static findByTemplateType(templateType: string): Promise<GeneratedCV[]>;
    static findRecent(limit?: number): Promise<GeneratedCV[]>;
    static exists(id: number): Promise<boolean>;
    static isOwner(cvId: number, userId: number): Promise<boolean>;
}
//# sourceMappingURL=cv.repository.d.ts.map