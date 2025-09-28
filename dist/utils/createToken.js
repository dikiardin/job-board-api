"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createToken = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    throw new Error("JWT_SECRET environment variable is required");
}
const createToken = (account, expiresIn) => {
    return (0, jsonwebtoken_1.sign)({ ...account }, JWT_SECRET, { expiresIn });
};
exports.createToken = createToken;
//# sourceMappingURL=createToken.js.map