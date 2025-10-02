export declare class PDFGenerationService {
    static generateCertificatePDF(data: {
        userName: string;
        userEmail: string;
        assessmentTitle: string;
        assessmentDescription?: string;
        score: number;
        totalQuestions: number;
        completedAt: Date;
        userId: number;
        certificateCode: string;
    }): Promise<Buffer>;
}
//# sourceMappingURL=pdfGeneration.service.d.ts.map