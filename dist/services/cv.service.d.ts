export interface CVAdditionalInfo {
    objective?: string;
    skills?: string[];
    languages?: Array<{
        name: string;
        level: string;
    }>;
    certifications?: Array<{
        name: string;
        issuer: string;
        date: string;
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
declare class CVService {
    getAvailableTemplates(): CVTemplate[];
    generateCV(userId: number, templateType?: string, additionalInfo?: CVAdditionalInfo): Promise<{
        id: number;
        fileUrl: string;
        templateUsed: string;
        createdAt: Date;
    }>;
    getUserCVs(userId: number): Promise<{
        createdAt: Date;
        id: number;
        fileUrl: string;
        templateUsed: string;
    }[]>;
    getCVById(cvId: number, userId: number): Promise<{
        createdAt: Date;
        id: number;
        userId: number;
        fileUrl: string;
        templateUsed: string;
        additionalInfo: import("../generated/prisma/runtime/library").JsonValue | null;
    } | null>;
    deleteCV(cvId: number, userId: number): Promise<void>;
}
export declare const cvService: CVService;
export {};
//# sourceMappingURL=cv.service.d.ts.map