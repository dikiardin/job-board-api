import { Prisma } from "../../generated/prisma";
export declare class PreselectionRepository {
    static getJob(jobId: number): Promise<({
        company: {
            name: string;
            email: string | null;
            phone: string | null;
            createdAt: Date;
            updatedAt: Date;
            city: string | null;
            id: number;
            location: string | null;
            description: string | null;
            website: string | null;
            logo: string | null;
            adminId: number | null;
        };
    } & {
        createdAt: Date;
        updatedAt: Date;
        city: string;
        id: number;
        companyId: number;
        description: string;
        title: string;
        category: string;
        salaryMin: number | null;
        salaryMax: number | null;
        tags: string[];
        banner: string | null;
        deadline: Date | null;
        isPublished: boolean;
    }) | null>;
    static getTestByJobId(jobId: number): Promise<({
        questions: {
            id: number;
            options: Prisma.JsonValue;
            question: string;
            answer: string;
            testId: number;
        }[];
    } & {
        createdAt: Date;
        id: number;
        isActive: boolean;
        jobId: number;
        passingScore: number | null;
    }) | null>;
    static getTestById(testId: number): Promise<({
        job: {
            company: {
                name: string;
                email: string | null;
                phone: string | null;
                createdAt: Date;
                updatedAt: Date;
                city: string | null;
                id: number;
                location: string | null;
                description: string | null;
                website: string | null;
                logo: string | null;
                adminId: number | null;
            };
        } & {
            createdAt: Date;
            updatedAt: Date;
            city: string;
            id: number;
            companyId: number;
            description: string;
            title: string;
            category: string;
            salaryMin: number | null;
            salaryMax: number | null;
            tags: string[];
            banner: string | null;
            deadline: Date | null;
            isPublished: boolean;
        };
        questions: {
            id: number;
            options: Prisma.JsonValue;
            question: string;
            answer: string;
            testId: number;
        }[];
    } & {
        createdAt: Date;
        id: number;
        isActive: boolean;
        jobId: number;
        passingScore: number | null;
    }) | null>;
    static createTest(jobId: number, questions: Array<{
        question: string;
        options: string[];
        answer: string;
    }>, passingScore?: number, isActive?: boolean): Promise<{
        questions: {
            id: number;
            options: Prisma.JsonValue;
            question: string;
            answer: string;
            testId: number;
        }[];
    } & {
        createdAt: Date;
        id: number;
        isActive: boolean;
        jobId: number;
        passingScore: number | null;
    }>;
    static deleteTestByJobId(jobId: number): Promise<{
        createdAt: Date;
        id: number;
        isActive: boolean;
        jobId: number;
        passingScore: number | null;
    }>;
    static upsertTest(jobId: number, questions: Array<{
        question: string;
        options: string[];
        answer: string;
    }>, passingScore?: number, isActive?: boolean): Promise<{
        questions: {
            id: number;
            options: Prisma.JsonValue;
            question: string;
            answer: string;
            testId: number;
        }[];
    } & {
        createdAt: Date;
        id: number;
        isActive: boolean;
        jobId: number;
        passingScore: number | null;
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
    }>;
    static getTestResultsByJob(jobId: number): Promise<({
        job: {
            createdAt: Date;
            updatedAt: Date;
            city: string;
            id: number;
            companyId: number;
            description: string;
            title: string;
            category: string;
            salaryMin: number | null;
            salaryMax: number | null;
            tags: string[];
            banner: string | null;
            deadline: Date | null;
            isPublished: boolean;
        };
        questions: {
            id: number;
            options: Prisma.JsonValue;
            question: string;
            answer: string;
            testId: number;
        }[];
        results: ({
            user: {
                role: import("../../generated/prisma").$Enums.UserRole;
                name: string;
                email: string;
                passwordHash: string | null;
                phone: string | null;
                gender: string | null;
                dob: Date | null;
                education: string | null;
                address: string | null;
                profilePicture: string | null;
                isVerified: boolean;
                createdAt: Date;
                updatedAt: Date;
                city: string | null;
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
        })[];
    } & {
        createdAt: Date;
        id: number;
        isActive: boolean;
        jobId: number;
        passingScore: number | null;
    }) | null>;
    static getResultsByTestAndUsers(testId: number, userIds: number[]): Promise<any[]>;
}
//# sourceMappingURL=preselection.repository.d.ts.map