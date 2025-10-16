"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EditProfileService = void 0;
const cloudinary_1 = require("../../config/cloudinary");
const editProfile_repository_1 = require("../../repositories/profile/editProfile.repository");
const customError_1 = require("../../utils/customError");
class EditProfileService {
    static async editProfile(userId, role, data, files) {
        const user = await editProfile_repository_1.EditProfileRepository.findUserById(userId);
        if (!user)
            throw new customError_1.CustomError("User not found", 404);
        let logoUrl;
        let bannerUrl;
        let profilePictureUrl;
        // Upload files to Cloudinary
        if (files?.logoFile) {
            const upload = await (0, cloudinary_1.cloudinaryUpload)(files.logoFile);
            logoUrl = upload.secure_url;
        }
        if (files?.bannerFile) {
            const upload = await (0, cloudinary_1.cloudinaryUpload)(files.bannerFile);
            bannerUrl = upload.secure_url;
        }
        if (files?.profilePictureFile) {
            const upload = await (0, cloudinary_1.cloudinaryUpload)(files.profilePictureFile);
            profilePictureUrl = upload.secure_url;
        }
        if (role === "USER") {
            const { phone, gender, dob, education, address, city } = data;
            return await editProfile_repository_1.EditProfileRepository.updateUserProfile(userId, {
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
                }
                catch (e) {
                    parsedSocials = {};
                }
            }
            const [companyResult, userResult] = await Promise.all([
                editProfile_repository_1.EditProfileRepository.updateCompanyProfile(userId, {
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
                editProfile_repository_1.EditProfileRepository.updateUserProfile(userId, {
                    phone,
                    address,
                    city: locationCity,
                    ...(profilePictureUrl && { profilePicture: profilePictureUrl }),
                }),
            ]);
            return { company: companyResult, user: userResult };
        }
        throw new customError_1.CustomError("Invalid role", 400);
    }
    static async completeProfile(userId, data, file) {
        const user = await editProfile_repository_1.EditProfileRepository.findUserById(userId);
        if (!user)
            throw new customError_1.CustomError("User not found", 404);
        if (!user.emailVerifiedAt)
            throw new customError_1.CustomError("User is not verified", 403);
        let profilePictureUrl;
        if (file) {
            const upload = await (0, cloudinary_1.cloudinaryUpload)(file);
            profilePictureUrl = upload.secure_url;
        }
        if (user.role === "USER") {
            const { phone, gender, dob, education, address, city } = data;
            return await editProfile_repository_1.EditProfileRepository.updateUserProfile(userId, {
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
                editProfile_repository_1.EditProfileRepository.updateCompanyProfile(userId, {
                    phone,
                    address: location,
                    locationCity: city,
                    description,
                    website,
                    ...(profilePictureUrl && { logoUrl: profilePictureUrl }),
                }),
                editProfile_repository_1.EditProfileRepository.updateUserProfile(userId, {
                    phone,
                    address: location,
                    city,
                    ...(profilePictureUrl && { profilePicture: profilePictureUrl }),
                }),
            ]);
            return { company: companyResult, user: userResult };
        }
        throw new customError_1.CustomError("Invalid role", 400);
    }
}
exports.EditProfileService = EditProfileService;
