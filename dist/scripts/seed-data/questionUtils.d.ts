import { PrismaClient } from "../../generated/prisma";
type OptionOverrides = Record<string, string> | undefined;
export declare function buildMCQ(prefix: string, count: number, correctOption?: string, optionOverrides?: OptionOverrides): {
    question: string;
    options: Record<string, string>;
    answer: string;
    orderIndex: number;
}[];
interface RecordAnswersParams {
    prisma: PrismaClient;
    resultId: number;
    testId: number;
    correctCount: number;
}
export declare function recordApplicantAnswers({ prisma, resultId, testId, correctCount, }: RecordAnswersParams): Promise<void>;
export {};
//# sourceMappingURL=questionUtils.d.ts.map