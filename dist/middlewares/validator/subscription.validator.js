"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionValidator = void 0;
const joi_1 = __importDefault(require("joi"));
class SubscriptionValidator {
}
exports.SubscriptionValidator = SubscriptionValidator;
// Subscription creation validation
SubscriptionValidator.validateSubscribeRequest = (req, res, next) => {
    const schema = joi_1.default.object({
        planId: joi_1.default.number().integer().positive().required(),
    });
    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({
            message: "Validation error",
            details: error.details?.[0]?.message || "Invalid request data",
        });
    }
    next();
};
// Subscription update validation
SubscriptionValidator.validateUpdateRequest = (req, res, next) => {
    const schema = joi_1.default.object({
        isActive: joi_1.default.boolean().optional(),
        startDate: joi_1.default.date().iso().optional(),
        endDate: joi_1.default.date().iso().optional(),
    });
    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({
            message: "Validation error",
            details: error.details?.[0]?.message || "Invalid request data",
        });
    }
    next();
};
// Plan creation validation
SubscriptionValidator.validatePlanCreation = (req, res, next) => {
    const schema = joi_1.default.object({
        planName: joi_1.default.string().min(3).max(50).required(),
        planPrice: joi_1.default.number().positive().required(),
        planDescription: joi_1.default.string().min(10).max(500).required(),
    });
    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({
            message: "Validation error",
            details: error.details?.[0]?.message || "Invalid request data",
        });
    }
    next();
};
// Plan update validation
SubscriptionValidator.validatePlanUpdate = (req, res, next) => {
    const schema = joi_1.default.object({
        planName: joi_1.default.string().min(3).max(50).optional(),
        planPrice: joi_1.default.number().positive().optional(),
        planDescription: joi_1.default.string().min(10).max(500).optional(),
    });
    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({
            message: "Validation error",
            details: error.details?.[0]?.message || "Invalid request data",
        });
    }
    next();
};
//# sourceMappingURL=subscription.validator.js.map