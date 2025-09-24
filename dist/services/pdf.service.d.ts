import { CVAdditionalInfo } from './cv.service';
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
declare class PDFService {
    generateCVPDF(cvData: CVData, templateType?: string): Promise<Buffer>;
    private generateATSTemplate;
    private generateModernTemplate;
    private generateCreativeTemplate;
}
export declare const pdfService: PDFService;
export {};
//# sourceMappingURL=pdf.service.d.ts.map