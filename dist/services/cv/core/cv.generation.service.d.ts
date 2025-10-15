import { CVData, CVAdditionalInfo } from "./cv.types";
export declare class CVGenerationService {
    static generateCV(userId: number, templateType?: string, additionalInfo?: CVAdditionalInfo): Promise<{
        cvId: number;
        fileUrl: string;
        cvData: CVData;
        templateType: string;
    }>;
    static updateCV(cvId: number, userId: number, templateType?: string, additionalInfo?: CVAdditionalInfo): Promise<{
        cvId: number;
        fileUrl: string;
        cvData: CVData;
        templateType: string;
    }>;
}
//# sourceMappingURL=cv.generation.service.d.ts.map