import { CVData } from '../core/cv.service';
export declare class PDFCoreService {
    generatePDF(cvData: CVData, templateType?: string): Promise<string>;
    private setupPDFDocument;
    private generatePDFContent;
    private handlePDFCompletion;
    private validatePDFBuffer;
    private generateFileName;
    private uploadPDFToCloudinary;
    addSectionHeader(doc: any, title: string, yPosition: number, margin: number, contentWidth: number): void;
    checkNewPage(doc: any, yPosition: number, threshold?: number): number;
    generateContactInfo(doc: any, cvData: CVData, pageWidth: number, yPosition: number): number;
    generateHeader(doc: any, cvData: CVData, pageWidth: number): number;
}
export declare const pdfCoreService: PDFCoreService;
//# sourceMappingURL=pdf.core.service.d.ts.map