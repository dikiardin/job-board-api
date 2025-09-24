export declare class CVManagementService {
    getUserCVs(userId: number): Promise<{
        createdAt: Date;
        id: number;
        fileUrl: string;
        templateUsed: string;
    }[]>;
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