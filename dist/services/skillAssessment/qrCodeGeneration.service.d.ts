export declare class QRCodeGenerationService {
    static generateQRCodeBuffer(verificationUrl: string, size?: number): Promise<Buffer | null>;
    static addQRCodeToPDF(doc: PDFKit.PDFDocument, certificateCode: string, qrY: number): Promise<void>;
    private static drawFallbackQRPattern;
    static generateVerificationUrl(certificateCode: string): string;
    static validateQRData(data: string): boolean;
    static getQRCodeInfo(certificateCode: string): {
        url: string;
        size: number;
        format: string;
        errorCorrection: string;
        margin: number;
        colors: {
            dark: string;
            light: string;
        };
    };
    static testQRGeneration(testUrl?: string): Promise<boolean>;
}
//# sourceMappingURL=qrCodeGeneration.service.d.ts.map