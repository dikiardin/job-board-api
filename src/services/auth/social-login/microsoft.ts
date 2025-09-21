import axios from "axios";

export const verifyMicrosoftToken = async (accessToken: string) => {
  const res = await axios.get("https://graph.microsoft.com/v1.0/me", {
    headers: { Authorization: `Bearer ${accessToken}` }
  });

  const data = res.data;
  return {
    providerId: data.id,
    email: data.mail || data.userPrincipalName,
    name: data.displayName,
  };
};