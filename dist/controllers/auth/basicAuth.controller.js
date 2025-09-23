"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BasicAuthController = void 0;
const basicAuth_service_1 = require("../../services/auth/basicAuth.service");
class BasicAuthController {
    static async register(req, res, next) {
        try {
            const { role, name, email, password } = req.body;
            if (role !== "USER" && role !== "ADMIN") {
                return res.status(400).json({ message: "Invalid role" });
            }
            const result = await basicAuth_service_1.BasicAuthService.register(role, name, email, password);
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
            const result = await basicAuth_service_1.BasicAuthService.verifyEmail(token);
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
            const result = await basicAuth_service_1.BasicAuthService.login(email, password);
            res.status(200).json(result);
        }
        catch (error) {
            next(error);
        }
    }
}
exports.BasicAuthController = BasicAuthController;
//# sourceMappingURL=basicAuth.controller.js.map