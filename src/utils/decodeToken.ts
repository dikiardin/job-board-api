import { verify } from "jsonwebtoken";

export const decodeToken = (token: string) => {
  const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";
  try {
    const decoded = verify(token, JWT_SECRET);
    return decoded;
  } catch (err:any) {
    return null;
  }
};
