import { UserRepo } from "../../repositories/user/user.repository";
import { CustomError } from "../../utils/customError";
import { comparePassword } from "../../utils/comparePassword";
import { hashPassword } from "../../utils/hashPassword";

export class ChangePasswordService {
  static async changePassword(
    userId: number,
    oldPassword: string,
    newPassword: string,
    confirmPassword: string
  ) {
    const user = await UserRepo.findByIdWithPassword(userId);
    if (!user) throw new CustomError("User not found", 404);

    if (!user.passwordHash) {
      throw new CustomError(
        "Password change not allowed for Google sign-in users",
        400
      );
    }
    const isMatch = await comparePassword(oldPassword, user.passwordHash);
    if (!isMatch) throw new CustomError("Old password is incorrect", 400);

    if (newPassword !== confirmPassword) {
      throw new CustomError("New password and confirm password do not match", 400);
    }

    const newHash = await hashPassword(newPassword);
    await UserRepo.updatePassword(user.id, newHash);

    return { message: "Password changed successfully" };
  }
}