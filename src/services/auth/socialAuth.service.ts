import { createToken } from "../../utils/createToken";
import { UserProviderRepo } from "../../repositories/user/userProvider.repository";
import { verifyGoogleToken } from "./google";
import { CreateCompanyService } from "../company/createCompany.service";
import { CreateEmploymentService } from "../employment/createEmployment.service";
import { UserRepo } from "../../repositories/user/user.repository";
import { resolveIsProfileComplete } from "../../utils/profileCompletion";

type SocialProfile = {
  providerId: string;
  email: string;
  name: string;
  picture?: string | null | undefined;
};

export class SocialAuthService {
  public static async socialLogin(
    provider: "GOOGLE",
    token: string,
    role: "ADMIN" | "USER"
  ) {
    let profile: SocialProfile | undefined;

    if (provider === "GOOGLE") {
      profile = await verifyGoogleToken(token);
    } else {
      throw { status: 400, message: "Unsupported provider" };
    }

    if (!profile) {
      throw { status: 400, message: "Failed to verify social profile" };
    }

    let userProvider = await UserProviderRepo.findByProvider(
      provider,
      profile.providerId
    );

    let user;

    if (userProvider) {
      user = userProvider.user;
      if (!user.profilePicture && profile.picture) {
        user = await UserProviderRepo.updateProfilePicture(
          user.id,
          profile.picture
        );
      }
    } else {
      const existing = await UserRepo.findByEmail(profile.email);

      if (existing) {
        user = existing;
        if (!user.profilePicture && profile.picture) {
          user = await UserProviderRepo.updateProfilePicture(
            user.id,
            profile.picture
          );
        }
      } else {
        user = await UserProviderRepo.createUserWithProvider({
          name: profile.name,
          email: profile.email,
          provider,
          providerId: profile.providerId,
          role,
          profilePicture: profile.picture ?? null,
        });

        if (role === "ADMIN") {
          await CreateCompanyService.createCompanyForAdmin(
            user.id,
            profile.name,
            profile.email
          );
        }

        if (role === "USER") {
          await CreateEmploymentService.createForNewUser(user.id);
        }
      }
    }

    const extendedUser =
      (await UserRepo.findWithCompany(user.id)) ?? { ...user, ownedCompany: null };

    const jwtToken = createToken({ userId: user.id, role: user.role }, "7d");
    return {
      ...user,
      token: jwtToken,
      isProfileComplete: resolveIsProfileComplete(extendedUser),
    };
  }
}
