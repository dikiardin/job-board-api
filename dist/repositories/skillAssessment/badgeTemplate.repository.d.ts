export declare class BadgeTemplateRepository {
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
    static getAllBadgeTemplates(page?: number, limit?: number): Promise<{
        templates: ({
            _count: {
                userBadges: number;
                assessments: number;
            };
            creator: {
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
        })[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    static getBadgeTemplateById(id: number): Promise<({
        _count: {
            userBadges: number;
            assessments: number;
        };
        creator: {
            email: string;
            name: string | null;
            id: number;
        };
        assessments: {
            id: number;
            title: string;
        }[];
    } & {
        name: string;
        createdAt: Date;
        updatedAt: Date;
        id: number;
        description: string | null;
        category: string | null;
        createdBy: number;
        icon: string | null;
    }) | null>;
    static getDeveloperBadgeTemplates(createdBy: number): Promise<({
        _count: {
            userBadges: number;
            assessments: number;
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
    })[]>;
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
    static searchBadgeTemplates(query: string): Promise<({
        _count: {
            userBadges: number;
            assessments: number;
        };
        creator: {
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
    })[]>;
    static getBadgeTemplateByName(name: string): Promise<{
        name: string;
        createdAt: Date;
        updatedAt: Date;
        id: number;
        description: string | null;
        category: string | null;
        createdBy: number;
        icon: string | null;
    } | null>;
    static getPopularBadgeTemplates(limit?: number): Promise<({
        _count: {
            userBadges: number;
            assessments: number;
        };
        creator: {
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
    })[]>;
    static getBadgeTemplatesByCategory(category: string): Promise<({
        _count: {
            userBadges: number;
            assessments: number;
        };
        creator: {
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
    })[]>;
    static checkBadgeTemplateNameExists(name: string, excludeId?: number): Promise<boolean>;
    static findByName(name: string): Promise<{
        name: string;
        createdAt: Date;
        updatedAt: Date;
        id: number;
        description: string | null;
        category: string | null;
        createdBy: number;
        icon: string | null;
    } | null>;
    static findByNameExcluding(name: string, excludeId: number): Promise<{
        name: string;
        createdAt: Date;
        updatedAt: Date;
        id: number;
        description: string | null;
        category: string | null;
        createdBy: number;
        icon: string | null;
    } | null>;
    static isBadgeTemplateInUse(id: number): Promise<boolean>;
    static getBadgeTemplateStats(): Promise<{
        totalTemplates: number;
        totalBadgesAwarded: number;
        totalAssessmentsWithBadges: number;
    }>;
}
//# sourceMappingURL=badgeTemplate.repository.d.ts.map