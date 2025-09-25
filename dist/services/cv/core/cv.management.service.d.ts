export declare class CVManagementService {
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
    getAvailableTemplates(): {
        id: string;
        name: string;
        description: string;
        preview: string;
    }[];
}
export declare const cvManagementService: CVManagementService;
//# sourceMappingURL=cv.management.service.d.ts.map