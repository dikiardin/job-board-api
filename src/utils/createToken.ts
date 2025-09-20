import { sign } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

export const createToken = (account: any, expiresIn: any) => {
  return sign({ ...account }, JWT_SECRET, { expiresIn });
};