import { createToken } from "../../utils/createToken";
import { UserProviderRepo } from "../../repositories/user/userProvider.repository";
import { verifyGoogleToken } from "./google";
import { CreateAdminService } from "../company-admin/createAdmin.service";
import { CreateEmploymentService } from "../employment/createEmployment.service";
import { UserRepo } from "../../repositories/user/user.repository";
import { CustomError } from "../../utils/customError";

type SocialProfile = { providerId: string; email: string; name: string };

// export class SocialAuthService {
//   public static async socialLogin(
//     provider: "GOOGLE",
//     token: string,
//     role: "ADMIN" | "USER",
//     companyId?: number
//   ) {
//     let profile: SocialProfile | undefined;
//     if (provider === "GOOGLE") {
//       profile = await verifyGoogleToken(token);
//     } else {
//       throw { status: 400, message: "Unsupported provider" };
//     }

//     if (!profile) {
//       throw { status: 400, message: "Failed to verify social profile" };
//     }

//     let userProvider = await UserProviderRepo.findByProvider(
//       provider,
//       profile.providerId
//     );
//     let user;

//     const existing = await UserRepo.findByEmail(profile.email);
//     if (existing) {
//       throw new CustomError("Email already in use", 409);
//     }

//     if (!userProvider) {
//       user = await UserProviderRepo.createUserWithProvider({
//         name: profile.name,
//         email: profile.email,
//         provider,
//         providerId: profile.providerId,
//         role,
//       });
//     } else {
//       user = userProvider.user;
//     }

//     if (role === "ADMIN") {
//       if (!companyId) {
//         throw new CustomError(
//           "Company ID is required for ADMIN registration",
//           400
//         );
//       }
//       await CreateAdminService.createForNewAdmin(user.id, companyId);
//     }

//     if (role === "USER") {
//       await CreateEmploymentService.createForNewUser(user.id);
//     }

//     const jwtToken = createToken({ userId: user.id, role: user.role }, "7d");
//     return { ...user, token: jwtToken };
//   }
// }

export class SocialAuthService {
  public static async socialLogin(
    provider: "GOOGLE",
    token: string,
    role: "ADMIN" | "USER",
    companyId?: number
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
    } else {
      const existing = await UserRepo.findByEmail(profile.email);

      if (existing) {
        user = existing;
      } else {
        user = await UserProviderRepo.createUserWithProvider({
          name: profile.name,
          email: profile.email,
          provider,
          providerId: profile.providerId,
          role,
        });

        if (role === "ADMIN") {
          if (!companyId) {
            throw new CustomError(
              "Company ID is required for ADMIN registration",
              400
            );
          }
          await CreateAdminService.createForNewAdmin(user.id, companyId);
        }

        if (role === "USER") {
          await CreateEmploymentService.createForNewUser(user.id);
        }
      }
    }

    // 3. Issue JWT for either sign-in or sign-up
    const jwtToken = createToken({ userId: user.id, role: user.role }, "7d");
    return { ...user, token: jwtToken };
  }
}
