/**
 * Manual Skill Categorization System
 * User must define their own categories - no predefined categories
 */

/**
 * Manual skill categorization - only uses user-defined categories
 * If no categories provided, returns all skills as uncategorized
 */
export function smartSkillCategorization(
  skills: string[], 
  userCategories?: Record<string, string[]>
): {
  categorized: Record<string, string[]>;
  uncategorized: string[];
} {
  const categorized: Record<string, string[]> = {};
  const uncategorized: string[] = [];

  // If user provides custom categories, use them
  if (userCategories && Object.keys(userCategories).length > 0) {
    skills.forEach(skill => {
      const lowerSkill = skill.toLowerCase();
      let isSkillCategorized = false;

      // Check user-defined categories
      for (const [categoryName, patterns] of Object.entries(userCategories)) {
        if (patterns.some(pattern => 
          lowerSkill.includes(pattern.toLowerCase()) || 
          pattern.toLowerCase().includes(lowerSkill)
        )) {
          if (!categorized[categoryName]) {
            categorized[categoryName] = [];
          }
          categorized[categoryName]!.push(skill);
          isSkillCategorized = true;
          break;
        }
      }

      if (!isSkillCategorized) {
        uncategorized.push(skill);
      }
    });

    return { categorized, uncategorized };
  }

  // If no user categories provided, all skills are uncategorized
  return { categorized: {}, uncategorized: skills };
}