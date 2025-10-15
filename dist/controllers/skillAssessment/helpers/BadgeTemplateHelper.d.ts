import { Request } from "express";
import { UserRole } from "../../../generated/prisma";
export declare class BadgeTemplateHelper {
    static validateDeveloperRole(role: UserRole): void;
    static validateTemplateId(templateId: string): number;
    static extractFormData(req: Request): {
        name: any;
        description: any;
        category: any;
        iconFile: Express.Multer.File | undefined;
    };
    static validateRequiredFields(name: string, iconFile: any): void;
    static validateImageFile(iconFile: any): void;
    static buildUpdateData(name?: string, description?: string, category?: string, iconUrl?: string): any;
}
//# sourceMappingURL=BadgeTemplateHelper.d.ts.map