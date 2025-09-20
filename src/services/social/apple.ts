import jwt from "jsonwebtoken";
import jwksClient from "jwks-rsa";

const client = jwksClient({
  jwksUri: "https://appleid.apple.com/auth/keys"
});

function getAppleKey(header: any, callback: any) {
  client.getSigningKey(header.kid, function (err, key) {
    if (err) callback(err);
    else callback(null, key?.getPublicKey());
  });
}

export const verifyAppleToken = (idToken: string) => {
  return new Promise<any>((resolve, reject) => {
    jwt.verify(idToken, getAppleKey, { algorithms: ["RS256"] }, (err, decoded: any) => {
      if (err) return reject(err);
      resolve({
        providerId: decoded.sub,
        email: decoded.email,
        name: decoded.email.split("@")[0], // Apple doesn't provide full name by default
      });
    });
  });
};