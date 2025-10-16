"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocialAuthController = void 0;
const socialAuth_service_1 = require("../../services/auth/socialAuth.service");
class SocialAuthController {
    static async socialLogin(req, res, next) {
        try {
            const { provider, token, role } = req.body;
            if (!["USER", "ADMIN"].includes(role)) {
                return res
                    .status(400)
                    .json({ success: false, message: "Invalid role" });
            }
            const result = await socialAuth_service_1.SocialAuthService.socialLogin(provider, token, role);
            res.status(200).json({ success: true, data: result });
        }
        catch (err) {
            next(err);
        }
    }
}
exports.SocialAuthController = SocialAuthController;
