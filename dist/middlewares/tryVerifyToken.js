"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tryVerifyToken = void 0;
const decodeToken_1 = require("../utils/decodeToken");
const tryVerifyToken = (req, res, next) => {
    try {
        const auth = req.headers.authorization;
        const token = auth?.split(" ")[1];
        if (!token)
            return next();
        const decoded = (0, decodeToken_1.decodeToken)(token);
        res.locals.decrypt = decoded;
        next();
    }
    catch (err) {
        // Optional auth: ignore errors and continue as public request
        return next();
    }
};
exports.tryVerifyToken = tryVerifyToken;
