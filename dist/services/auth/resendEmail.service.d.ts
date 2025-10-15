export declare class EmailService {
    static sendEmail(to: string, subject: string, html: string): Promise<void>;
    static sendVerificationEmail(name: string, email: string, token: string): Promise<void>;
}
//# sourceMappingURL=resendEmail.service.d.ts.map