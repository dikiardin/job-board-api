"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateEmploymentRepo = void 0;
const prisma_1 = require("../../config/prisma");
class CreateEmploymentRepo {
    static async createEmploymentForUser(userId) {
        return prisma_1.prisma.employment.create({
            data: {
                userId,
                companyId: null,
                startDate: null,
                endDate: null,
            },
        });
    }
}
exports.CreateEmploymentRepo = CreateEmploymentRepo;
//# sourceMappingURL=createEmployment.repository.js.map