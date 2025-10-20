"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeepLoginController = void 0;
const keepLogin_service_1 = require("../../services/auth/keepLogin.service");
class KeepLoginController {
    static async keepLogin(req, res, next) {
        try {
            const userId = parseInt(res.locals.decrypt.userId);
            if (!userId || isNaN(userId)) {
                return res.status(401).json({
                    success: false,
                    message: "Invalid user ID in token"
                });
            }
            const result = await keepLogin_service_1.KeepLoginService.keepLogin(userId);
            res.status(200).json({ success: true, data: result });
        }
        catch (error) {
            console.error("Error in keepLogin controller:", error);
            // Handle specific error cases
            if (error?.statusCode === 404) {
                return res.status(404).json({
                    success: false,
                    message: "User not found. Please sign in again."
                });
            }
            else if (error?.statusCode === 500) {
                return res.status(500).json({
                    success: false,
                    message: error.message || "Authentication failed. Please try again later."
                });
            }
            // For any other error, pass to error handler
            next(error);
        }
    }
}
exports.KeepLoginController = KeepLoginController;
