import { GeneratedCV } from '../../generated/prisma';
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
export declare class CVRepositoryBase {
    create(data: CVCreateData): Promise<GeneratedCV>;
    findById(id: number): Promise<GeneratedCV | null>;
    findByIdWithUser(id: number): Promise<CVWithUser | null>;
    findByIdAndUserId(id: number, userId: number): Promise<GeneratedCV | null>;
    updateById(id: number, data: CVUpdateData): Promise<GeneratedCV>;
    deleteById(id: number): Promise<GeneratedCV>;
    deleteByIdAndUserId(id: number, userId: number): Promise<GeneratedCV | null>;
    exists(id: number): Promise<boolean>;
    isOwner(cvId: number, userId: number): Promise<boolean>;
}
export declare const cvRepositoryBase: CVRepositoryBase;
//# sourceMappingURL=cv.repository.base.d.ts.map