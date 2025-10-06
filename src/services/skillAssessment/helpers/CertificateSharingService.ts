export class CertificateSharingService {
  public static generateShareLinks(shareUrl: string, shareText: string) {
    return {
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(shareText)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`,
    };
  }

  public static buildShareText(assessmentTitle: string, score: number): string {
    return `I just earned a certificate in ${assessmentTitle} with a score of ${score}%! 🎓`;
  }

  public static buildShareUrl(certificateCode: string): string {
    return `${process.env.FRONTEND_URL}/verify-certificate/${certificateCode}`;
  }

  public static getShareLinkByPlatform(platform: string, shareLinks: any): string {
    return shareLinks[platform.toLowerCase()];
  }
}
