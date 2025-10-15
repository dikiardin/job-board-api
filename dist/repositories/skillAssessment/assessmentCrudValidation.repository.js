"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssessmentCrudValidationRepository = void 0;
const prisma_1 = require("../../config/prisma");
class AssessmentCrudValidationRepository {
    // Check if assessment title is available
    static async isAssessmentTitleAvailable(title, excludeId) {
        const where = { title };
        if (excludeId)
            where.id = { not: excludeId };
        const existing = await prisma_1.prisma.skillAssessment.findFirst({ where });
        return !existing;
    }
}
exports.AssessmentCrudValidationRepository = AssessmentCrudValidationRepository;
//# sourceMappingURL=assessmentCrudValidation.repository.js.map