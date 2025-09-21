"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = void 0;
const decodeToken_1 = require("../utils/decodeToken");
const customError_1 = require("../utils/customError");
const verifyToken = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        console.log("Authorization Header:", authHeader);
        const token = authHeader?.split(" ")[1];
        console.log("Extracted Token:", token);
        if (!token) {
            throw new customError_1.CustomError("Unauthorized token", 401);
        }
        const decoded = (0, decodeToken_1.decodeToken)(token);
        console.log("Decoded Token:", decoded);
        res.locals.decrypt = decoded;
        next();
    }
    catch (error) {
        console.log("Verify Token Error:", error);
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
//# sourceMappingURL=verifyToken.js.map