export declare class AssessmentExecutionRetakeService {
    static canRetakeAssessment(userId: number, assessmentId: number): Promise<boolean>;
    static resetAssessmentForRetake(userId: number, assessmentId: number): Promise<{
        message: string;
    }>;
}
//# sourceMappingURL=assessmentExecutionRetake.service.d.ts.map