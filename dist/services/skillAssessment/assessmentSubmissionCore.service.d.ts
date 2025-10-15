export declare class AssessmentSubmissionCoreService {
    static submitAssessment(data: {
        assessmentId: number;
        userId: number;
        answers: Array<{
            questionId: number;
            answer: string;
        }>;
        startedAt: string;
    }): Promise<{
        result: {
            id: number;
            slug: any;
            score: number;
            correctAnswers: number;
            totalQuestions: number;
            passed: boolean;
            timeSpent: number;
            completedAt: Date;
            certificateUrl: string | undefined;
            certificateCode: string | undefined;
        };
        certificate: {
            certificateUrl: string;
            certificateCode: string;
        } | null;
    }>;
    private static validateSubmission;
    private static generateCertificate;
    private static saveAssessmentResult;
}
//# sourceMappingURL=assessmentSubmissionCore.service.d.ts.map