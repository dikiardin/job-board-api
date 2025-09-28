"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EditProfileService = void 0;
const cloudinary_1 = require("../../config/cloudinary");
const editProfile_repository_1 = require("../../repositories/profile/editProfile.repository");
const customError_1 = require("../../utils/customError");
class EditProfileService {
    static async editProfile(userId, role, data, file) {
        const user = await editProfile_repository_1.EditProfileRepository.findUserById(userId);
        if (!user)
            throw new customError_1.CustomError("User not found", 404);
        let profilePictureUrl;
        if (file) {
            const upload = await (0, cloudinary_1.cloudinaryUpload)(file);
            profilePictureUrl = upload.secure_url;
        }
        if (role === "USER") {
            const { phone, gender, dob, education, address } = data;
            return await editProfile_repository_1.EditProfileRepository.updateUserProfile(userId, {
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
            return await editProfile_repository_1.EditProfileRepository.updateCompanyProfile(userId, {
                phone,
                location,
                description,
                website,
                logo: profilePictureUrl,
            });
        }
        throw new customError_1.CustomError("Invalid role", 400);
    }
}
exports.EditProfileService = EditProfileService;
//# sourceMappingURL=editProfile.service.js.map