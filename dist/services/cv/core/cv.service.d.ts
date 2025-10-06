import { CVAdditionalInfo } from "./cv.types";
export { CVData, CVAdditionalInfo, CVTemplate } from "./cv.types";
declare class CVService {
    generateCV(userId: number, templateType?: string, additionalInfo?: CVAdditionalInfo): Promise<{
        cvId: number;
        pdfBuffer: Buffer<ArrayBuffer>;
        cvData: import("./cv.types").CVData;
        templateType: string;
    }>;
    updateCV(cvId: number, userId: number, templateType?: string, additionalInfo?: CVAdditionalInfo): Promise<{
        cvId: number;
        pdfBuffer: Buffer<ArrayBuffer>;
        cvData: import("./cv.types").CVData;
        templateType: string;
    }>;
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
        isATS: boolean;
    }[];
}
export declare const cvService: CVService;
//# sourceMappingURL=cv.service.d.ts.map