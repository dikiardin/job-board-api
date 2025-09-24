import { CVData } from './cv.service';
export declare class PDFService {
    generatePDF(cvData: CVData, templateType?: string): Promise<string>;
    private addSectionHeader;
    private generateATSTemplate;
}
export declare const pdfService: PDFService;
//# sourceMappingURL=pdf.service.d.ts.map