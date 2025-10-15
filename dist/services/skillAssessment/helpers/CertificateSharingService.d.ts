export declare class CertificateSharingService {
    static generateShareLinks(shareUrl: string, shareText: string): {
        linkedin: string;
        facebook: string;
        twitter: string;
        whatsapp: string;
    };
    static buildShareText(assessmentTitle: string, score: number): string;
    static buildShareUrl(certificateCode: string): string;
    static getShareLinkByPlatform(platform: string, shareLinks: any): string;
}
//# sourceMappingURL=CertificateSharingService.d.ts.map