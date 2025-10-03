import { Prisma } from "../../generated/prisma";
export declare class PreselectionRepository {
    static getJob(jobId: string | number): Promise<({
        company: {
            name: string;
            address: string | null;
            createdAt: Date;
            updatedAt: Date;
            id: number;
            slug: string;
            description: string | null;
            logoUrl: string | null;
            bannerUrl: string | null;
            website: string | null;
            locationCity: string | null;
            locationProvince: string | null;
            locationCountry: string | null;
            socials: Prisma.JsonValue | null;
            ownerAdminId: number | null;
        };
    } & {
        city: string;
        createdAt: Date;
        updatedAt: Date;
        id: number;
        companyId: number;
        slug: string;
        description: string;
        bannerUrl: string | null;
        title: string;
        category: string;
        employmentType: string | null;
        experienceLevel: string | null;
        province: string | null;
        salaryMin: number | null;
        salaryMax: number | null;
        salaryCurrency: string | null;
        tags: string[];
        applyDeadline: Date | null;
        isPublished: boolean;
        publishedAt: Date | null;
    }) | null>;
    static getTestByJobId(jobId: string | number): Promise<({
        questions: {
            id: number;
            options: Prisma.JsonValue;
            question: string;
            answer: string;
            orderIndex: number;
            testId: number;
        }[];
    } & {
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        id: number;
        jobId: number;
        passingScore: number | null;
        questionCount: number;
        timeLimitMinutes: number;
    }) | null>;
    static getTestById(testId: number): Promise<({
        job: {
            company: {
                name: string;
                address: string | null;
                createdAt: Date;
                updatedAt: Date;
                id: number;
                slug: string;
                description: string | null;
                logoUrl: string | null;
                bannerUrl: string | null;
                website: string | null;
                locationCity: string | null;
                locationProvince: string | null;
                locationCountry: string | null;
                socials: Prisma.JsonValue | null;
                ownerAdminId: number | null;
            };
        } & {
            city: string;
            createdAt: Date;
            updatedAt: Date;
            id: number;
            companyId: number;
            slug: string;
            description: string;
            bannerUrl: string | null;
            title: string;
            category: string;
            employmentType: string | null;
            experienceLevel: string | null;
            province: string | null;
            salaryMin: number | null;
            salaryMax: number | null;
            salaryCurrency: string | null;
            tags: string[];
            applyDeadline: Date | null;
            isPublished: boolean;
            publishedAt: Date | null;
        };
        questions: {
            id: number;
            options: Prisma.JsonValue;
            question: string;
            answer: string;
            orderIndex: number;
            testId: number;
        }[];
    } & {
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        id: number;
        jobId: number;
        passingScore: number | null;
        questionCount: number;
        timeLimitMinutes: number;
    }) | null>;
    static createTest(jobId: string | number, questions: Array<{
        question: string;
        options: string[];
        answer: string;
    }>, passingScore?: number, isActive?: boolean): Promise<{
        questions: {
            id: number;
            options: Prisma.JsonValue;
            question: string;
            answer: string;
            orderIndex: number;
            testId: number;
        }[];
    } & {
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        id: number;
        jobId: number;
        passingScore: number | null;
        questionCount: number;
        timeLimitMinutes: number;
    }>;
    static deleteTestByJobId(jobId: string | number): Promise<{
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        id: number;
        jobId: number;
        passingScore: number | null;
        questionCount: number;
        timeLimitMinutes: number;
    }>;
    static upsertTest(jobId: string | number, questions: Array<{
        question: string;
        options: string[];
        answer: string;
    }>, passingScore?: number, isActive?: boolean): Promise<{
        questions: {
            id: number;
            options: Prisma.JsonValue;
            question: string;
            answer: string;
            orderIndex: number;
            testId: number;
        }[];
    } & {
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        id: number;
        jobId: number;
        passingScore: number | null;
        questionCount: number;
        timeLimitMinutes: number;
    }>;
    static getResult(userId: number, testId: number): Promise<({
        answers: {
            id: number;
            selected: string;
            isCorrect: boolean;
            resultId: number;
            questionId: number;
        }[];
    } & {
        createdAt: Date;
        id: number;
        userId: number;
        testId: number;
        score: number;
        passed: boolean;
    }) | null>;
    static createResult(userId: number, testId: number, score: number, answers: Array<{
        questionId: number;
        selected: string;
        isCorrect: boolean;
    }>): Promise<{
        answers: {
            id: number;
            selected: string;
            isCorrect: boolean;
            resultId: number;
            questionId: number;
        }[];
    } & {
        createdAt: Date;
        id: number;
        userId: number;
        testId: number;
        score: number;
        passed: boolean;
    }>;
    static getTestResultsByJob(jobId: string | number): Promise<({
        job: {
            city: string;
            createdAt: Date;
            updatedAt: Date;
            id: number;
            companyId: number;
            slug: string;
            description: string;
            bannerUrl: string | null;
            title: string;
            category: string;
            employmentType: string | null;
            experienceLevel: string | null;
            province: string | null;
            salaryMin: number | null;
            salaryMax: number | null;
            salaryCurrency: string | null;
            tags: string[];
            applyDeadline: Date | null;
            isPublished: boolean;
            publishedAt: Date | null;
        };
        questions: {
            id: number;
            options: Prisma.JsonValue;
            question: string;
            answer: string;
            orderIndex: number;
            testId: number;
        }[];
        results: ({
            user: {
                role: import("../../generated/prisma").$Enums.UserRole;
                email: string;
                passwordHash: string | null;
                name: string | null;
                phone: string | null;
                gender: string | null;
                dob: Date | null;
                education: string | null;
                address: string | null;
                city: string | null;
                profilePicture: string | null;
                emailVerifiedAt: Date | null;
                verificationToken: string | null;
                verificationTokenExpiresAt: Date | null;
                passwordResetToken: string | null;
                passwordResetExpiresAt: Date | null;
                emailChangeToken: string | null;
                emailChangeNewEmail: string | null;
                emailChangeExpiresAt: Date | null;
                lastLoginAt: Date | null;
                isActive: boolean;
                createdAt: Date;
                updatedAt: Date;
                id: number;
            };
            answers: {
                id: number;
                selected: string;
                isCorrect: boolean;
                resultId: number;
                questionId: number;
            }[];
        } & {
            createdAt: Date;
            id: number;
            userId: number;
            testId: number;
            score: number;
            passed: boolean;
        })[];
    } & {
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        id: number;
        jobId: number;
        passingScore: number | null;
        questionCount: number;
        timeLimitMinutes: number;
    }) | null>;
    static getResultsByTestAndUsers(testId: number, userIds: number[]): Promise<any[]>;
}
//# sourceMappingURL=preselection.repository.d.ts.map