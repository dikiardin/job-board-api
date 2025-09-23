"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocialAuthController = void 0;
const socialAuth_service_1 = require("../../services/auth/socialAuth.service");
class SocialAuthController {
    static async socialUser(req, res, next) {
        try {
            const { provider, token } = req.body;
            const result = await socialAuth_service_1.SocialAuthService.socialLogin(provider, token, "USER");
            res.status(200).json({ success: true, data: result });
        }
        catch (err) {
            next(err);
        }
    }
    static async socialAdmin(req, res, next) {
        try {
            const { provider, token } = req.body;
            const result = await socialAuth_service_1.SocialAuthService.socialLogin(provider, token, "ADMIN");
            res.status(200).json({ success: true, data: result });
        }
        catch (err) {
            next(err);
        }
    }
}
exports.SocialAuthController = SocialAuthController;
//# sourceMappingURL=socialAuth.controller.js.map