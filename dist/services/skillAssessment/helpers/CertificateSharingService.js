"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CertificateSharingService = void 0;
class CertificateSharingService {
    static generateShareLinks(shareUrl, shareText) {
        return {
            linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(shareText)}`,
            facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`,
            twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`,
            whatsapp: `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`,
        };
    }
    static buildShareText(assessmentTitle, score) {
        return `I just earned a certificate in ${assessmentTitle} with a score of ${score}%! 🎓`;
    }
    static buildShareUrl(certificateCode) {
        return `${process.env.FRONTEND_URL}/verify-certificate/${certificateCode}`;
    }
    static getShareLinkByPlatform(platform, shareLinks) {
        return shareLinks[platform.toLowerCase()];
    }
}
exports.CertificateSharingService = CertificateSharingService;
//# sourceMappingURL=CertificateSharingService.js.map