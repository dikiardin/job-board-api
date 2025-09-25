import { cloudinaryUpload } from "../../config/cloudinary";
import { CompleteProfileRepository } from "../../repositories/complete-profile/completeProfile.repository";
import { CustomError } from "../../utils/customError";

export class CompleteProfileService {
  public static async completeProfile(
    userId: number,
    role: "USER" | "ADMIN",
    data: any,
    file?: Express.Multer.File
  ) {
    const user = await CompleteProfileRepository.findUserById(userId);
    if (!user) throw new CustomError("User not found", 404);

    let profilePictureUrl: string | undefined;
    if (file) {
      const upload = await cloudinaryUpload(file);
      profilePictureUrl = upload.secure_url;
    }

    if (role === "USER") {
      const { phone, gender, dob, education, address } = data;
      return await CompleteProfileRepository.updateUserProfile(userId, {
        phone,
        gender,
        dob: dob ? new Date(dob) : undefined,
        education,
        address,
        profilePicture: profilePictureUrl,
      });
    }

    if (role === "ADMIN") {
      const { phone, location, description, website } = data;
      return await CompleteProfileRepository.updateCompanyProfile(userId, {
        phone,
        location,
        description,
        website,
        logo: profilePictureUrl,
      });
    }

    throw new CustomError("Invalid role", 400);
  }
}