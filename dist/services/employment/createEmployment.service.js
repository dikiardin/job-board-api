"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateEmploymentService = void 0;
const createEmployment_repository_1 = require("../../repositories/employment/createEmployment.repository");
class CreateEmploymentService {
    static async createForNewUser(userId) {
        return createEmployment_repository_1.CreateEmploymentRepo.createEmploymentForUser(userId);
    }
}
exports.CreateEmploymentService = CreateEmploymentService;
