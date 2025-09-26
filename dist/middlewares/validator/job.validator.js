"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateListJobs = validateListJobs;
exports.validateApplicantsList = validateApplicantsList;
exports.validateUpdateApplicantStatus = validateUpdateApplicantStatus;
const joi_1 = __importDefault(require("joi"));
const listJobsQuerySchema = joi_1.default.object({
    title: joi_1.default.string().trim().optional(),
    category: joi_1.default.string().trim().optional(),
    city: joi_1.default.string().trim().optional(),
    sortBy: joi_1.default.string().valid("createdAt", "deadline").optional(),
    sortOrder: joi_1.default.string().valid("asc", "desc").optional(),
    limit: joi_1.default.number().integer().min(1).max(100).optional(),
    offset: joi_1.default.number().integer().min(0).optional(),
});
function validateListJobs(req, res, next) {
    const { error, value } = listJobsQuerySchema.validate(req.query, { abortEarly: false, stripUnknown: true });
    if (error)
        return res.status(400).json({ message: "Invalid query", errors: error.details.map((d) => d.message) });
    req.query = value;
    next();
}
const applicantsListQuerySchema = joi_1.default.object({
    name: joi_1.default.string().trim().optional(),
    education: joi_1.default.string().trim().optional(),
    ageMin: joi_1.default.number().integer().min(0).optional(),
    ageMax: joi_1.default.number().integer().min(0).optional(),
    expectedSalaryMin: joi_1.default.number().integer().min(0).optional(),
    expectedSalaryMax: joi_1.default.number().integer().min(0).optional(),
    sortBy: joi_1.default.string().valid("appliedAt", "expectedSalary", "age").optional(),
    sortOrder: joi_1.default.string().valid("asc", "desc").optional(),
    limit: joi_1.default.number().integer().min(1).max(100).optional(),
    offset: joi_1.default.number().integer().min(0).optional(),
});
function validateApplicantsList(req, res, next) {
    const { error, value } = applicantsListQuerySchema.validate(req.query, { abortEarly: false, stripUnknown: true });
    if (error)
        return res.status(400).json({ message: "Invalid query", errors: error.details.map((d) => d.message) });
    req.query = value;
    next();
}
const updateApplicantStatusBody = joi_1.default.object({
    status: joi_1.default.string().valid("IN_REVIEW", "INTERVIEW", "ACCEPTED", "REJECTED").required(),
    reviewNote: joi_1.default.string().allow(null, '').max(500).optional(),
});
function validateUpdateApplicantStatus(req, res, next) {
    const { error, value } = updateApplicantStatusBody.validate(req.body, { abortEarly: false, stripUnknown: true });
    if (error)
        return res.status(400).json({ message: "Invalid body", errors: error.details.map((d) => d.message) });
    req.body = value;
    next();
}
//# sourceMappingURL=job.validator.js.map