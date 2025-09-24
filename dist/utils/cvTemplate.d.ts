/**
 * Manual Skill Categorization System
 * User must define their own categories - no predefined categories
 */
/**
 * Manual skill categorization - only uses user-defined categories
 * If no categories provided, returns all skills as uncategorized
 */
export declare function smartSkillCategorization(skills: string[], userCategories?: Record<string, string[]>): {
    categorized: Record<string, string[]>;
    uncategorized: string[];
};
//# sourceMappingURL=cvTemplate.d.ts.map