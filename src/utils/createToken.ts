import { sign } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is required");
}

export const createToken = (account: any, expiresIn: any) => {
  return sign({ ...account }, JWT_SECRET, { expiresIn });
};