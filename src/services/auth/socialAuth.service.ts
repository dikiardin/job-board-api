import { createToken } from "../../utils/createToken";
import { UserProviderRepo } from "../../repositories/user/userProvider.repository";
import { verifyGoogleToken } from "./social-login/google";
import { verifyAppleToken } from "./social-login/apple";
import { verifyMicrosoftToken } from "./social-login/microsoft";

export class SocialAuthService {
  public static async socialLogin(
    provider: "GOOGLE" | "APPLE" | "MICROSOFT",
    token: string
  ) {
    let profile;
    if (provider === "GOOGLE") profile = await verifyGoogleToken(token);
    if (provider === "APPLE") profile = await verifyAppleToken(token);
    if (provider === "MICROSOFT") profile = await verifyMicrosoftToken(token);

    let userProvider = await UserProviderRepo.findByProvider(
      provider,
      profile.providerId
    );
    let user;

    if (!userProvider) {
      user = await UserProviderRepo.createUserWithProvider({
        name: profile.name,
        email: profile.email,
        provider,
        providerId: profile.providerId,
      });
    } else {
      user = userProvider.user;
    }

    const jwtToken = createToken({ userId: user.id, role: user.role }, "7d");
    return { ...user, token: jwtToken };
  }
}
