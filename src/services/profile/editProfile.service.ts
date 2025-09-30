import { cloudinaryUpload } from "../../config/cloudinary";
import { EditProfileRepository } from "../../repositories/profile/editProfile.repository";
import { CustomError } from "../../utils/customError";

export class EditProfileService {
  public static async editProfile(
    userId: number,
    role: "USER" | "ADMIN",
    data: any,
    file?: Express.Multer.File
  ) {
    const user = await EditProfileRepository.findUserById(userId);
    if (!user) throw new CustomError("User not found", 404);

    let profilePictureUrl: string | undefined;
    if (file) {
      const upload = await cloudinaryUpload(file);
      profilePictureUrl = upload.secure_url;
    }

    if (role === "USER") {
      const { phone, gender, dob, education, address, city } = data;
      return await EditProfileRepository.updateUserProfile(userId, {
        phone,
        gender,
        dob: dob ? new Date(dob) : undefined,
        education,
        address,
        city,
        ...(profilePictureUrl && { profilePicture: profilePictureUrl }),
      });
    }

    if (role === "ADMIN") {
      const { phone, location, city, description, website } = data;
      const [companyResult, userResult] = await Promise.all([
        EditProfileRepository.updateCompanyProfile(userId, {
          phone,
          location,
          city,
          description,
          website,
          ...(profilePictureUrl && { logo: profilePictureUrl }),
        }),
        EditProfileRepository.updateUserProfile(userId, {
          phone,
          address:location,
          city,
          ...(profilePictureUrl && { profilePicture: profilePictureUrl }),
        }),
      ]);

      return { company: companyResult, user: userResult };
    }

    throw new CustomError("Invalid role", 400);
  }

  public static async completeProfile(
    userId: number,
    data: any,
    file?: Express.Multer.File
  ) {
    const user = await EditProfileRepository.findUserById(userId);
    if (!user) throw new CustomError("User not found", 404);
    if (!user.isVerified) throw new CustomError("User is not verified", 403);

    let profilePictureUrl: string | undefined;
    if (file) {
      const upload = await cloudinaryUpload(file);
      profilePictureUrl = upload.secure_url;
    }

    if (user.role === "USER") {
      const { phone, gender, dob, education, address, city } = data;
      return await EditProfileRepository.updateUserProfile(userId, {
        phone,
        gender,
        dob: dob ? new Date(dob) : undefined,
        education,
        address,
        city,
        ...(profilePictureUrl && { profilePicture: profilePictureUrl }),
      });
    }

    if (user.role === "ADMIN") {
      const { phone, location, city, description, website } = data;
      return await EditProfileRepository.updateCompanyProfile(userId, {
        phone,
        location,
        city,
        description,
        website,
        ...(profilePictureUrl && { logo: profilePictureUrl }),
      });
    }

    throw new CustomError("Invalid role", 400);
  }
}
