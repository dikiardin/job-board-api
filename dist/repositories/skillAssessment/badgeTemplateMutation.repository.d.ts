export declare class BadgeTemplateMutationRepository {
    static createBadgeTemplate(data: {
        name: string;
        icon?: string;
        description?: string;
        category?: string;
        createdBy: number;
    }): Promise<{
        _count: {
            userBadges: number;
            assessments: number;
        };
        creator: {
            email: string;
            name: string | null;
            id: number;
        };
    } & {
        name: string;
        createdAt: Date;
        updatedAt: Date;
        id: number;
        description: string | null;
        category: string | null;
        createdBy: number;
        icon: string | null;
    }>;
    static updateBadgeTemplate(id: number, createdBy: number, data: {
        name?: string;
        icon?: string;
        description?: string;
        category?: string;
    }): Promise<import("../../generated/prisma").Prisma.BatchPayload>;
    static deleteBadgeTemplate(id: number, createdBy: number): Promise<{
        count: number;
        error: string;
    } | {
        count: number;
        error?: never;
    }>;
}
//# sourceMappingURL=badgeTemplateMutation.repository.d.ts.map