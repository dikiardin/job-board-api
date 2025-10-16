"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decodeToken = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const decodeToken = (token) => {
    const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";
    try {
        const decoded = (0, jsonwebtoken_1.verify)(token, JWT_SECRET);
        return decoded;
    }
    catch (err) {
        return null;
    }
};
exports.decodeToken = decodeToken;
