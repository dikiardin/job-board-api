import { sign, verify, JwtPayload } from "jsonwebtoken";
import { CustomError } from "./customError";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is required");
}

export const createToken = (account: any, expiresIn: any) => {
  return sign({ ...account }, JWT_SECRET, { expiresIn });
};

export const verifyToken = (token: string): JwtPayload => {
  try {
    return verify(token, JWT_SECRET) as JwtPayload;
  } catch (err: any) {
    if (err.name === "TokenExpiredError") {
      throw new CustomError("Expired verification link", 400);
    }
    throw new CustomError("Invalid verification link", 400);
  }
};
