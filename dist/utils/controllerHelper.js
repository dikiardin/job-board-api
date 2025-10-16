"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ControllerHelper = void 0;
const customError_1 = require("./customError");
class ControllerHelper {
    static parseId(id) {
        if (!id) {
            throw new customError_1.CustomError("ID is required", 400);
        }
        const parsedId = parseInt(id);
        if (isNaN(parsedId)) {
            throw new customError_1.CustomError("Invalid ID format", 400);
        }
        return parsedId;
    }
    static getUserId(res) {
        const userId = parseInt(res.locals.decrypt.userId);
        if (isNaN(userId)) {
            throw new customError_1.CustomError("Invalid user ID", 400);
        }
        return userId;
    }
    static validateRequired(data, message) {
        const missingFields = Object.entries(data)
            .filter(([_, value]) => !value)
            .map(([key, _]) => key);
        if (missingFields.length > 0) {
            throw new customError_1.CustomError(message, 400);
        }
    }
    static buildUpdateData(body, allowedFields) {
        const updateData = {};
        allowedFields.forEach(field => {
            if (body[field] !== undefined) {
                if (field.includes('Date') && body[field]) {
                    updateData[field] = new Date(body[field]);
                }
                else {
                    updateData[field] = body[field];
                }
            }
        });
        return updateData;
    }
}
exports.ControllerHelper = ControllerHelper;
