import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const verifyGoogleToken = async (tokenId: string) => {
  if (!process.env.GOOGLE_CLIENT_ID)
    throw new Error("GOOGLE_CLIENT_ID not set");

  const ticket = await client.verifyIdToken({
    idToken: tokenId,
    audience: process.env.GOOGLE_CLIENT_ID,
  });
  
  const payload = ticket.getPayload();
  if (!payload) throw new Error("Invalid Google token");
  return {
    providerId: payload.sub,
    email: payload.email!,
    name: payload.name!,
    picture: payload.picture,
  };
};
