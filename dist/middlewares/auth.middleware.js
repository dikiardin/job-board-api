"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = require("../config/prisma");
const authMiddleware = async (req, res, next) => {
    try {
        const token = req.header("Authorization")?.replace("Bearer ", "");
        if (!token) {
            return res.status(401).json({ message: "Access denied. No token provided." });
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        const user = await prisma_1.prisma.user.findUnique({
            where: { id: decoded.userId },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                emailVerifiedAt: true,
            },
        });
        if (!user) {
            return res.status(401).json({ message: "Invalid token. User not found." });
        }
        if (!user.emailVerifiedAt) {
            return res.status(401).json({ message: "Account not verified." });
        }
        req.user = {
            id: user.id,
            email: user.email,
            name: user.name ?? "",
            role: user.role,
            emailVerified: Boolean(user.emailVerifiedAt),
        };
        next();
    }
    catch (error) {
        res.status(401).json({ message: "Invalid token." });
    }
};
exports.authMiddleware = authMiddleware;
//# sourceMappingURL=auth.middleware.js.map