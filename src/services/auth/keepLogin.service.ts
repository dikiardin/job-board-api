import { createToken } from "../../utils/createToken";
import { CustomError } from "../../utils/customError";
import { UserRepo } from "../../repositories/user/user.repository";

export class KeepLoginService {
  public static async keepLogin(userId: number) {
    const user = await UserRepo.findById(userId);
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
    };
  }
}