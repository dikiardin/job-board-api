"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyAppleToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const jwks_rsa_1 = __importDefault(require("jwks-rsa"));
const client = (0, jwks_rsa_1.default)({
    jwksUri: "https://appleid.apple.com/auth/keys"
});
function getAppleKey(header, callback) {
    client.getSigningKey(header.kid, function (err, key) {
        if (err)
            callback(err);
        else
            callback(null, key?.getPublicKey());
    });
}
const verifyAppleToken = (idToken) => {
    return new Promise((resolve, reject) => {
        jsonwebtoken_1.default.verify(idToken, getAppleKey, { algorithms: ["RS256"] }, (err, decoded) => {
            if (err)
                return reject(err);
            resolve({
                providerId: decoded.sub,
                email: decoded.email,
                name: decoded.email.split("@")[0], // Apple doesn't provide full name by default
            });
        });
    });
};
exports.verifyAppleToken = verifyAppleToken;
//# sourceMappingURL=apple.js.map