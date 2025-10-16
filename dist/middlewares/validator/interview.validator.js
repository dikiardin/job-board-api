"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateCreateManyInterviews = validateCreateManyInterviews;
exports.validateUpdateInterview = validateUpdateInterview;
const joi_1 = __importDefault(require("joi"));
const createManySchema = joi_1.default.object({
    items: joi_1.default.array().items(joi_1.default.object({
        applicantId: joi_1.default.number().integer().required(),
        scheduleDate: joi_1.default.date().iso().required(),
        locationOrLink: joi_1.default.string().allow(null, '').optional(),
        notes: joi_1.default.string().allow(null, '').max(500).optional(),
    })).min(1).max(50).required(),
});
function validateCreateManyInterviews(req, res, next) {
    const { error, value } = createManySchema.validate(req.body, { abortEarly: false, stripUnknown: true });
    if (error)
        return res.status(400).json({ message: "Invalid body", errors: error.details.map((d) => d.message) });
    req.body = value;
    next();
}
const updateSchema = joi_1.default.object({
    scheduleDate: joi_1.default.date().iso().optional(),
    locationOrLink: joi_1.default.string().allow(null, '').optional(),
    notes: joi_1.default.string().allow(null, '').max(500).optional(),
    status: joi_1.default.string().valid('SCHEDULED', 'COMPLETED', 'CANCELLED', 'NO_SHOW').optional(),
}).or('scheduleDate', 'locationOrLink', 'notes', 'status');
function validateUpdateInterview(req, res, next) {
    const { error, value } = updateSchema.validate(req.body, { abortEarly: false, stripUnknown: true });
    if (error)
        return res.status(400).json({ message: "Invalid body", errors: error.details.map((d) => d.message) });
    req.body = value;
    next();
}
