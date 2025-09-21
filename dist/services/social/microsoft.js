"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyMicrosoftToken = void 0;
const axios_1 = __importDefault(require("axios"));
const verifyMicrosoftToken = async (accessToken) => {
    const res = await axios_1.default.get("https://graph.microsoft.com/v1.0/me", {
        headers: { Authorization: `Bearer ${accessToken}` }
    });
    const data = res.data;
    return {
        providerId: data.id,
        email: data.mail || data.userPrincipalName,
        name: data.displayName,
    };
};
exports.verifyMicrosoftToken = verifyMicrosoftToken;
//# sourceMappingURL=microsoft.js.map