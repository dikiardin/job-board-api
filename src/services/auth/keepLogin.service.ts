import { createToken } from "../../utils/createToken";
import { CustomError } from "../../utils/customError";
import { UserRepo } from "../../repositories/user/user.repository";
import { resolveIsProfileComplete } from "../../utils/profileCompletion";

export class KeepLoginService {
  public static async keepLogin(userId: number) {
    try {
      const user = await UserRepo.findWithCompany(userId);
      if (!user) throw new CustomError("Account not found", 404);

      const newToken = createToken({ userId: user.id, role: user.role }, "7d");

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: !!user.emailVerifiedAt,
        token: newToken,
        profilePicture: user.profilePicture,
        isProfileComplete: resolveIsProfileComplete(user),
      };
    } catch (error) {
      console.error("Error in keepLogin service:", error);
      
      // If it's a database connection error, provide a more specific message
      if (error instanceof Error && error.message.includes("connect")) {
        throw new CustomError("Database connection failed. Please try again later.", 500);
      }
      
      // Re-throw the original error if it's already a CustomError
      if (error instanceof CustomError) {
        throw error;
      }
      
      // For any other error, wrap it in a CustomError
      throw new CustomError("Authentication failed. Please try again.", 500);
    }
  }
}
