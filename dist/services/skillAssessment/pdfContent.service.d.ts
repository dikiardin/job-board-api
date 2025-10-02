export declare class PDFContentService {
    static addHeader(doc: PDFKit.PDFDocument): void;
    static addCertificateBody(doc: PDFKit.PDFDocument, data: any): void;
    static addScoreSection(doc: PDFKit.PDFDocument, data: any): void;
    static addDatesSection(doc: PDFKit.PDFDocument, data: any): void;
    static addFooter(doc: PDFKit.PDFDocument, qrY: number): void;
    static calculateQRPosition(data: any): number;
    private static getAchievementLevel;
    static convertToBuffer(doc: PDFKit.PDFDocument): Promise<Buffer>;
}
//# sourceMappingURL=pdfContent.service.d.ts.map