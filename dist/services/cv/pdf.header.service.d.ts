export declare class PDFHeaderService {
    generateHeader(doc: any, cvData: any, pageWidth: number, margin: number): number;
    generateSummary(doc: any, cvData: any, yPosition: number, margin: number, contentWidth: number): number;
    generateProjects(doc: any, cvData: any, yPosition: number, margin: number, contentWidth: number): number;
    addSectionHeader(doc: any, title: string, yPosition: number, margin: number, contentWidth: number): void;
}
export declare const pdfHeaderService: PDFHeaderService;
//# sourceMappingURL=pdf.header.service.d.ts.map