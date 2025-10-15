export declare class SkillAssessmentResultsMutationRepository {
    static saveAssessmentResult(data: {
        userId: number;
        assessmentId: number;
        score: number;
        isPassed: boolean;
        certificateUrl?: string;
        certificateCode?: string;
    }): Promise<{
        user: {
            email: string;
            name: string | null;
            id: number;
        };
        assessment: {
            id: number;
            description: string | null;
            title: string;
        };
    } & {
        createdAt: Date;
        updatedAt: Date;
        id: number;
        userId: number;
        slug: string;
        answers: import("../../generated/prisma/runtime/library").JsonValue | null;
        score: number;
        assessmentId: number;
        isPassed: boolean;
        startedAt: Date | null;
        finishedAt: Date | null;
        durationSeconds: number | null;
        certificateUrl: string | null;
        certificateCode: string | null;
    }>;
    static updateCertificateInfo(resultId: number, certificateUrl: string, certificateCode: string): Promise<{
        createdAt: Date;
        updatedAt: Date;
        id: number;
        userId: number;
        slug: string;
        answers: import("../../generated/prisma/runtime/library").JsonValue | null;
        score: number;
        assessmentId: number;
        isPassed: boolean;
        startedAt: Date | null;
        finishedAt: Date | null;
        durationSeconds: number | null;
        certificateUrl: string | null;
        certificateCode: string | null;
    }>;
}
//# sourceMappingURL=skillAssessmentResultsMutation.repository.d.ts.map