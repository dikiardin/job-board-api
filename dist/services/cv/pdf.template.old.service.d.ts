export declare class PDFTemplateService {
    generateATSTemplate(doc: any, cvData: any): void;
    addSectionHeader(doc: any, title: string, yPosition: number, margin: number, contentWidth: number): void;
    addEducationSection(doc: any, cvData: any, yPosition: number, margin: number, contentWidth: number): number;
    addCertificationsSection(doc: any, cvData: any, yPosition: number, margin: number, contentWidth: number): number;
    addSkillsSection(doc: any, cvData: any, yPosition: number, margin: number, contentWidth: number): number;
}
export declare const pdfTemplateService: PDFTemplateService;
//# sourceMappingURL=pdf.template.old.service.d.ts.map