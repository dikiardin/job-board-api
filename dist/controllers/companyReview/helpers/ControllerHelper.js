"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ControllerHelper = void 0;
class ControllerHelper {
    static getUserId(res) {
        return res.locals.decrypt.userId;
    }
    static getCompanyId(req) {
        return req.params.companyId;
    }
    static getPaginationParams(req) {
        return {
            page: parseInt(req.query.page || '1'),
            limit: parseInt(req.query.limit || '10'),
            sortBy: req.query.sortBy || 'createdAt',
            sortOrder: req.query.sortOrder || 'desc'
        };
    }
    static sendSuccessResponse(res, message, data, statusCode = 200) {
        res.status(statusCode).json({
            success: true,
            message,
            data
        });
    }
    static sendDeleteResponse(res, message) {
        res.status(200).json({
            success: true,
            message
        });
    }
}
exports.ControllerHelper = ControllerHelper;
//# sourceMappingURL=ControllerHelper.js.map