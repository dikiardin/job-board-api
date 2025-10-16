"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = void 0;
const decodeToken_1 = require("../utils/decodeToken");
const customError_1 = require("../utils/customError");
const verifyToken = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader?.split(" ")[1];
        if (!token) {
            throw new customError_1.CustomError("Unauthorized token", 401);
        }
        const decoded = (0, decodeToken_1.decodeToken)(token);
        res.locals.decrypt = decoded;
        next();
    }
    catch (error) {
        if (process.env.NODE_ENV !== 'production') {
            console.log("Verify Token Error:", error);
        }
        if (error.name === "JsonWebTokenError") {
            return res.status(401).json({ success: false, message: "Invalid token format" });
        }
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ success: false, message: "Token has expired" });
        }
        next(error);
    }
};
exports.verifyToken = verifyToken;
