"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyGoogleToken = void 0;
const google_auth_library_1 = require("google-auth-library");
const client = new google_auth_library_1.OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const verifyGoogleToken = async (tokenId) => {
    if (!process.env.GOOGLE_CLIENT_ID)
        throw new Error("GOOGLE_CLIENT_ID not set");
    const ticket = await client.verifyIdToken({
        idToken: tokenId,
        audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    if (!payload)
        throw new Error("Invalid Google token");
    return {
        providerId: payload.sub,
        email: payload.email,
        name: payload.name,
        picture: payload.picture,
    };
};
exports.verifyGoogleToken = verifyGoogleToken;
//# sourceMappingURL=google.js.map