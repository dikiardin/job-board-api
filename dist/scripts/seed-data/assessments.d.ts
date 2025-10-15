import { Badge, BadgeTemplate, PrismaClient, SkillAssessment, SkillResult } from "../../generated/prisma";
import { SeedUsersResult } from "./users";
interface SeedAssessmentsOptions {
    prisma: PrismaClient;
    now: Date;
    addDays: (days: number) => Date;
    users: SeedUsersResult;
}
export interface SeedAssessmentsResult {
    badgeTemplates: {
        frontend: BadgeTemplate;
        data: BadgeTemplate;
        test: BadgeTemplate;
        javascript: BadgeTemplate;
        react: BadgeTemplate;
    };
    assessments: {
        frontend: SkillAssessment;
        data: SkillAssessment;
        test: SkillAssessment;
        javascript: SkillAssessment;
        react: SkillAssessment;
    };
    badgePriorityReviewer: Badge;
    skillResults: {
        alice: SkillResult;
        gina: SkillResult;
        bob: SkillResult;
        testProfessional: SkillResult;
        testStandard: SkillResult;
    };
}
export declare function seedAssessments({ prisma, now, addDays, users, }: SeedAssessmentsOptions): Promise<SeedAssessmentsResult>;
export {};
//# sourceMappingURL=assessments.d.ts.map