"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.createToken = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const customError_1 = require("./customError");
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    throw new Error("JWT_SECRET environment variable is required");
}
const createToken = (account, expiresIn) => {
    return (0, jsonwebtoken_1.sign)({ ...account }, JWT_SECRET, { expiresIn });
};
exports.createToken = createToken;
const verifyToken = (token) => {
    try {
        return (0, jsonwebtoken_1.verify)(token, JWT_SECRET);
    }
    catch (err) {
        if (err.name === "TokenExpiredError") {
            throw new customError_1.CustomError("Expired verification link", 400);
        }
        throw new customError_1.CustomError("Invalid verification link", 400);
    }
};
exports.verifyToken = verifyToken;
//# sourceMappingURL=createToken.js.map