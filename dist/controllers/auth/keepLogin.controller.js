"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeepLoginController = void 0;
const keepLogin_service_1 = require("../../services/auth/keepLogin.service");
class KeepLoginController {
    static async keepLogin(req, res, next) {
        try {
            const userId = parseInt(res.locals.decrypt.userId);
            const result = await keepLogin_service_1.KeepLoginService.keepLogin(userId);
            res.status(200).json({ success: true, data: result });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.KeepLoginController = KeepLoginController;
