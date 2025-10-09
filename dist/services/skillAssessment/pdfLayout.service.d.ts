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
    private static setupDocumentLayout;
    private static addLogo;
    private static addHeader;
    private static addUserInfo;
    private static addScoreInfo;
    private static addDateAndSignature;
    private static addQRCode;
    private static generateBuffer;
}
//# sourceMappingURL=pdfLayout.service.d.ts.map