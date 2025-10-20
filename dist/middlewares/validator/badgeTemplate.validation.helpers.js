"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractFormDataFields = exports.validateBadgeNameForUpdate = exports.validateBadgeFile = exports.validateBadgeCategory = exports.validateBadgeDescription = exports.validateBadgeName = void 0;
const MIN_BADGE_NAME_LENGTH = 3;
const MAX_BADGE_NAME_LENGTH = 50;
const MAX_DESCRIPTION_LENGTH = 200;
const MAX_CATEGORY_LENGTH = 30;
const validateBadgeName = (name) => {
    if (!name || typeof name !== "string") {
        return {
            valid: false,
            error: "Badge name is required and must be at least 3 characters long",
        };
    }
    if (name.trim().length < MIN_BADGE_NAME_LENGTH) {
        return {
            valid: false,
            error: "Badge name is required and must be at least 3 characters long",
        };
    }
    if (name.trim().length > MAX_BADGE_NAME_LENGTH) {
        return { valid: false, error: "Badge name must not exceed 50 characters" };
    }
    return { valid: true };
};
exports.validateBadgeName = validateBadgeName;
const validateBadgeDescription = (description) => {
    if (!description) {
        return { valid: true };
    }
    if (typeof description !== "string" ||
        description.length > MAX_DESCRIPTION_LENGTH) {
        return {
            valid: false,
            error: "Description must not exceed 200 characters",
        };
    }
    return { valid: true };
};
exports.validateBadgeDescription = validateBadgeDescription;
const validateBadgeCategory = (category) => {
    if (!category) {
        return { valid: true };
    }
    if (typeof category !== "string" || category.length > MAX_CATEGORY_LENGTH) {
        return { valid: false, error: "Category must not exceed 30 characters" };
    }
    return { valid: true };
};
exports.validateBadgeCategory = validateBadgeCategory;
const validateBadgeFile = (file) => {
    if (!file) {
        return { valid: false, error: "Badge icon image is required" };
    }
    return { valid: true };
};
exports.validateBadgeFile = validateBadgeFile;
const validateBadgeNameForUpdate = (name) => {
    if (!name) {
        return { valid: true };
    }
    if (typeof name !== "string" ||
        name.trim().length < MIN_BADGE_NAME_LENGTH ||
        name.trim().length > MAX_BADGE_NAME_LENGTH) {
        return {
            valid: false,
            error: "Badge name must be between 3 and 50 characters long",
        };
    }
    return { valid: true };
};
exports.validateBadgeNameForUpdate = validateBadgeNameForUpdate;
const extractFormDataFields = (body) => {
    const bodyKeys = Object.keys(body);
    const nameKey = bodyKeys.find((key) => key.trim() === "name") || "name";
    const descKey = bodyKeys.find((key) => key.trim() === "description") || "description";
    const catKey = bodyKeys.find((key) => key.trim() === "category") || "category";
    return {
        name: body[nameKey],
        description: body[descKey],
        category: body[catKey],
    };
};
exports.extractFormDataFields = extractFormDataFields;
