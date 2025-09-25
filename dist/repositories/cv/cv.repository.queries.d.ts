import { GeneratedCV } from '../../generated/prisma';
export declare class CVRepositoryQueries {
    findByUserId(userId: number): Promise<Partial<GeneratedCV>[]>;
    findByUserIdWithDetails(userId: number): Promise<GeneratedCV[]>;
    countByUserId(userId: number): Promise<number>;
    countByUserIdThisMonth(userId: number): Promise<number>;
    findByTemplateType(templateType: string): Promise<GeneratedCV[]>;
    findRecent(limit?: number): Promise<GeneratedCV[]>;
}
export declare const cvRepositoryQueries: CVRepositoryQueries;
//# sourceMappingURL=cv.repository.queries.d.ts.map