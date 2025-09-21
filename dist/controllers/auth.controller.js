"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const auth_service_1 = require("../services/auth.service");
class AuthController {
    static async register(req, res, next) {
        try {
            const { role, name, email, password, phone } = req.body;
            // validate role strictly
            if (role !== "USER" && role !== "ADMIN") {
                return res.status(400).json({ message: "Invalid role" });
            }
            const result = await auth_service_1.AuthService.register(role, name, email, password, phone);
            res.status(201).json(result);
        }
        catch (error) {
            next(error);
        }
    }
    static async verifyEmail(req, res, next) {
        try {
            const { token } = req.params;
            if (!token) {
                return res.status(400).json({ error: "Token missing" });
            }
            const result = await auth_service_1.AuthService.verifyEmail(token);
            res.status(200).json(result);
        }
        catch (error) {
            next(error);
        }
    }
    static async login(req, res, next) {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                return res.status(400).json({ error: "Missing email or password" });
            }
            const result = await auth_service_1.AuthService.login(email, password);
            res.status(200).json(result);
        }
        catch (error) {
            next(error);
        }
    }
    static async keepLogin(req, res, next) {
        try {
            const userId = parseInt(res.locals.decrypt.userId);
            const result = await auth_service_1.AuthService.keepLogin(userId);
            res.status(200).json({ success: true, data: result });
        }
        catch (error) {
            next(error);
        }
    }
    static async socialLogin(req, res, next) {
        try {
            const { provider, token } = req.body;
            const result = await auth_service_1.AuthService.socialLogin(provider, token);
            res.status(200).json({ success: true, data: result });
        }
        catch (err) {
            next(err);
        }
    }
}
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map