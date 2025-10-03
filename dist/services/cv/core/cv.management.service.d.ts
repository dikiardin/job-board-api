export declare class CVManagementService {
    getUserCVs(userId: number): Promise<Partial<{
        createdAt: Date;
        updatedAt: Date;
        id: number;
        userId: number;
        title: string | null;
        fileUrl: string;
        templateUsed: string;
        additionalInfo: import("../../../generated/prisma/runtime/library").JsonValue | null;
        isPriority: boolean;
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