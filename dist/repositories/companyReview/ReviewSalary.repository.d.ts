export declare class ReviewSalaryRepository {
    static getSalaryEstimates(companyId: number | string): Promise<{
        position: string;
        count: number;
        averageSalary: string;
        minSalary: number;
        maxSalary: number;
    }[]>;
}
//# sourceMappingURL=ReviewSalary.repository.d.ts.map