export declare class ForgotPasswordService {
    static requestReset(email: string): Promise<{
        message: string;
    }>;
    static resetPassword(token: string, newPassword: string, confirmPassword: string): Promise<{
        message: string;
    }>;
}
//# sourceMappingURL=forgotPassword.service.d.ts.map