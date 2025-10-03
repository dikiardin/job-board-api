export declare class PDFLayoutService {
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
        badgeIcon?: string;
    }): Promise<Buffer>;
}
//# sourceMappingURL=pdfLayout.service.d.ts.map