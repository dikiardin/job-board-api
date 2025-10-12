import { BadgeTemplateQueryRepository } from "./badgeTemplateQuery.repository";
import { BadgeTemplateMutationRepository } from "./badgeTemplateMutation.repository";
import { BadgeTemplateValidationRepository } from "./badgeTemplateValidation.repository";
import { BadgeTemplateStatsRepository } from "./badgeTemplateStats.repository";

export class BadgeTemplateRepository {
  // Create badge template (Developer only)
  public static async createBadgeTemplate(data: {
    name: string;
    icon?: string;
    description?: string;
    category?: string;
    createdBy: number;
  }) {
    return BadgeTemplateMutationRepository.createBadgeTemplate(data);
  }

  // Get all badge templates
  public static async getAllBadgeTemplates(
    page: number = 1,
    limit: number = 10
  ) {
    return BadgeTemplateQueryRepository.getAllBadgeTemplates(page, limit);
  }

  // Get badge template by ID
  public static async getBadgeTemplateById(id: number) {
    return BadgeTemplateQueryRepository.getBadgeTemplateById(id);
  }

  // Get developer's badge templates
  public static async getDeveloperBadgeTemplates(createdBy: number) {
    return BadgeTemplateQueryRepository.getDeveloperBadgeTemplates(createdBy);
  }

  // Update badge template
  public static async updateBadgeTemplate(
    id: number,
    createdBy: number,
    data: {
      name?: string;
      icon?: string;
      description?: string;
      category?: string;
    }
  ) {
    return BadgeTemplateMutationRepository.updateBadgeTemplate(
      id,
      createdBy,
      data
    );
  }

  // Delete badge template
  public static async deleteBadgeTemplate(id: number, createdBy: number) {
    return BadgeTemplateMutationRepository.deleteBadgeTemplate(id, createdBy);
  }

  // Search badge templates by category or name
  public static async searchBadgeTemplates(query: string) {
    return BadgeTemplateQueryRepository.searchBadgeTemplates(query);
  }

  // Get badge template by name (for assessment creation)
  public static async getBadgeTemplateByName(name: string) {
    return BadgeTemplateQueryRepository.getBadgeTemplateByName(name);
  }

  // Get popular badge templates (most used)
  public static async getPopularBadgeTemplates(limit: number = 10) {
    return BadgeTemplateQueryRepository.getPopularBadgeTemplates(limit);
  }

  // Get badge templates by category
  public static async getBadgeTemplatesByCategory(category: string) {
    return BadgeTemplateQueryRepository.getBadgeTemplatesByCategory(category);
  }

  // Check if badge template name exists
  public static async checkBadgeTemplateNameExists(
    name: string,
    excludeId?: number
  ) {
    return BadgeTemplateValidationRepository.checkBadgeTemplateNameExists(
      name,
      excludeId
    );
  }

  // Find badge template by name
  public static async findByName(name: string) {
    return BadgeTemplateQueryRepository.findByName(name);
  }

  // Find badge template by name excluding specific ID
  public static async findByNameExcluding(name: string, excludeId: number) {
    return BadgeTemplateQueryRepository.findByNameExcluding(name, excludeId);
  }

  // Check if badge template is in use
  public static async isBadgeTemplateInUse(id: number): Promise<boolean> {
    return BadgeTemplateValidationRepository.isBadgeTemplateInUse(id);
  }

  // Get badge template statistics
  public static async getBadgeTemplateStats() {
    return BadgeTemplateStatsRepository.getBadgeTemplateStats();
  }
}
