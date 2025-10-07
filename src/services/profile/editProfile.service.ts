import { cloudinaryUpload } from "../../config/cloudinary";
import { EditProfileRepository } from "../../repositories/profile/editProfile.repository";
import { CustomError } from "../../utils/customError";

export class EditProfileService {
  public static async editProfile(
    userId: number,
    role: "USER" | "ADMIN",
    data: any,
    files?: { logoFile?: Express.Multer.File | undefined; bannerFile?: Express.Multer.File | undefined; profilePictureFile?: Express.Multer.File | undefined }
  ) {
    const user = await EditProfileRepository.findUserById(userId);
    if (!user) throw new CustomError("User not found", 404);

    let logoUrl: string | undefined;
    let bannerUrl: string | undefined;
    let profilePictureUrl: string | undefined;

    // Upload files to Cloudinary
    if (files?.logoFile) {
      const upload = await cloudinaryUpload(files.logoFile);
      logoUrl = upload.secure_url;
    }
    if (files?.bannerFile) {
      const upload = await cloudinaryUpload(files.bannerFile);
      bannerUrl = upload.secure_url;
    }
    if (files?.profilePictureFile) {
      const upload = await cloudinaryUpload(files.profilePictureFile);
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
      const { name, email, phone, address, locationCity, locationProvince, city, description, website, socials } = data;
      
      // Parse socials if it's a string
      let parsedSocials = socials;
      if (typeof socials === 'string') {
        try {
          parsedSocials = JSON.parse(socials);
        } catch (e) {
          parsedSocials = {};
        }
      }

      const [companyResult, userResult] = await Promise.all([
        EditProfileRepository.updateCompanyProfile(userId, {
          ...(name && { name }),
          ...(email && { email }),
          phone,
          address,
          locationCity,
          ...(locationProvince && { locationProvince }),
          description,
          website,
          ...(parsedSocials && { socials: parsedSocials }),
          ...(logoUrl && { logoUrl }),
          ...(bannerUrl && { bannerUrl }),
        }),
        EditProfileRepository.updateUserProfile(userId, {
          phone,
          address,
          city: locationCity,
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
    if (!user.emailVerifiedAt) throw new CustomError("User is not verified", 403);

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
      const [companyResult, userResult] = await Promise.all([
        EditProfileRepository.updateCompanyProfile(userId, {
          phone,
          address: location,
          locationCity: city,
          description,
          website,
          ...(profilePictureUrl && { logoUrl: profilePictureUrl }),
        }),
        EditProfileRepository.updateUserProfile(userId, {
          phone,
          address: location,
          city,
          ...(profilePictureUrl && { profilePicture: profilePictureUrl }),
        }),
      ]);

      return { company: companyResult, user: userResult };
    }
    
    throw new CustomError("Invalid role", 400);
  }
}
