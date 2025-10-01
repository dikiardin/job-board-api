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
    skillCategories?: Record<string, string[]>;
    linkedin?: string;
    portfolio?: string;
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
declare class CVService {
    generateCV(userId: number, templateType?: string, additionalInfo?: CVAdditionalInfo): Promise<{
        id: number;
        fileUrl: string;
        templateUsed: string;
        createdAt: Date;
    }>;
    updateCV(cvId: number, userId: number, templateType?: string, additionalInfo?: CVAdditionalInfo): Promise<{
        id: number;
        fileUrl: string;
        templateUsed: string;
        createdAt: Date;
    }>;
    getUserCVs(userId: number): Promise<Partial<{
        createdAt: Date;
        id: number;
        userId: number;
        fileUrl: string;
        templateUsed: string;
        additionalInfo: import("../../../generated/prisma/runtime/library").JsonValue | null;
    }>[]>;
    getCVById(cvId: number, userId: number): Promise<any>;
    deleteCV(cvId: number, userId: number): Promise<{
        message: string;
    }>;
    getAvailableTemplates(): any;
}
export declare const cvService: CVService;
export {};
//# sourceMappingURL=cv.service.d.ts.map