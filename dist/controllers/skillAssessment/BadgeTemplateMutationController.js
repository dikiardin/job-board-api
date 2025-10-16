"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BadgeTemplateMutationController = void 0;
const badgeTemplate_repository_1 = require("../../repositories/skillAssessment/badgeTemplate.repository");
const BadgeTemplateHelper_1 = require("./helpers/BadgeTemplateHelper");
const customError_1 = require("../../utils/customError");
const cloudinary_1 = require("../../config/cloudinary");
class BadgeTemplateMutationController {
    // Create badge template (Developer only)
    static async createBadgeTemplate(req, res, next) {
        try {
            const { userId, role } = res.locals.decrypt;
            BadgeTemplateHelper_1.BadgeTemplateHelper.validateDeveloperRole(role);
            const { name, description, category, iconFile } = BadgeTemplateHelper_1.BadgeTemplateHelper.extractFormData(req);
            BadgeTemplateHelper_1.BadgeTemplateHelper.validateRequiredFields(name, iconFile);
            if (iconFile) {
                BadgeTemplateHelper_1.BadgeTemplateHelper.validateImageFile(iconFile);
            }
            const existingTemplate = await badgeTemplate_repository_1.BadgeTemplateRepository.findByName(name);
            if (existingTemplate) {
                throw new customError_1.CustomError("Badge template with this name already exists", 400);
            }
            if (!iconFile) {
                throw new customError_1.CustomError("Badge icon image is required", 400);
            }
            const uploadResult = await (0, cloudinary_1.cloudinaryUpload)(iconFile);
            const badgeTemplate = await badgeTemplate_repository_1.BadgeTemplateRepository.createBadgeTemplate({
                name,
                description: description || "",
                category: category || "General",
                icon: uploadResult.secure_url,
                createdBy: userId,
            });
            res.status(201).json({
                success: true,
                message: "Badge template created successfully",
                data: badgeTemplate,
            });
        }
        catch (error) {
            next(error);
        }
    }
    // Update badge template (Developer only)
    static async updateBadgeTemplate(req, res, next) {
        try {
            const { userId, role } = res.locals.decrypt;
            BadgeTemplateHelper_1.BadgeTemplateHelper.validateDeveloperRole(role);
            const templateId = BadgeTemplateHelper_1.BadgeTemplateHelper.validateTemplateId(req.params.templateId || "0");
            const { name, description, category, iconFile } = BadgeTemplateHelper_1.BadgeTemplateHelper.extractFormData(req);
            if (name) {
                const existingTemplate = await badgeTemplate_repository_1.BadgeTemplateRepository.findByNameExcluding(name, templateId);
                if (existingTemplate) {
                    throw new customError_1.CustomError("Badge template with this name already exists", 400);
                }
            }
            const currentTemplate = await badgeTemplate_repository_1.BadgeTemplateRepository.getBadgeTemplateById(templateId);
            if (!currentTemplate) {
                throw new customError_1.CustomError("Badge template not found", 404);
            }
            let iconUrl = currentTemplate.icon;
            if (iconFile) {
                BadgeTemplateHelper_1.BadgeTemplateHelper.validateImageFile(iconFile);
                const uploadResult = await (0, cloudinary_1.cloudinaryUpload)(iconFile);
                iconUrl = uploadResult.secure_url;
            }
            const updateData = BadgeTemplateHelper_1.BadgeTemplateHelper.buildUpdateData(name, description, category, iconUrl || undefined);
            const result = await badgeTemplate_repository_1.BadgeTemplateRepository.updateBadgeTemplate(templateId, userId, updateData);
            if (result.count === 0) {
                throw new customError_1.CustomError("Badge template not found or no permission", 404);
            }
            res.status(200).json({
                success: true,
                message: "Badge template updated successfully",
            });
        }
        catch (error) {
            next(error);
        }
    }
    // Delete badge template (Developer only)
    static async deleteBadgeTemplate(req, res, next) {
        try {
            const { userId, role } = res.locals.decrypt;
            BadgeTemplateHelper_1.BadgeTemplateHelper.validateDeveloperRole(role);
            const templateId = BadgeTemplateHelper_1.BadgeTemplateHelper.validateTemplateId(req.params.templateId || "0");
            const result = await badgeTemplate_repository_1.BadgeTemplateRepository.deleteBadgeTemplate(templateId, userId);
            if (result.count === 0) {
                throw new customError_1.CustomError("Badge template not found or no permission", 404);
            }
            res.status(200).json({
                success: true,
                message: "Badge template deleted successfully",
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.BadgeTemplateMutationController = BadgeTemplateMutationController;
