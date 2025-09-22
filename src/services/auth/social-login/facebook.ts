import axios from "axios";

export const verifyFacebookToken = async (accessToken: string) => {
  const res = await axios.get("https://graph.facebook.com/me?fields=id,name,email", {
    params: {
      fields: "id,name,email,picture",
      access_token: accessToken,
    },
  });

  const data = res.data;
  if (!data.email) throw new Error("Facebook account has no email");

  return {
    providerId: data.id,
    email: data.email,
    name: data.name,
  };
};