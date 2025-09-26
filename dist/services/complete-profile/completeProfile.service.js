"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompleteProfileService = void 0;
const cloudinary_1 = require("../../config/cloudinary");
const completeProfile_repository_1 = require("../../repositories/complete-profile/completeProfile.repository");
const customError_1 = require("../../utils/customError");
class CompleteProfileService {
    static async completeProfile(userId, role, data, file) {
        const user = await completeProfile_repository_1.CompleteProfileRepository.findUserById(userId);
        if (!user)
            throw new customError_1.CustomError("User not found", 404);
        let profilePictureUrl;
        if (file) {
            const upload = await (0, cloudinary_1.cloudinaryUpload)(file);
            profilePictureUrl = upload.secure_url;
        }
        if (role === "USER") {
            const { phone, gender, dob, education, address } = data;
            return await completeProfile_repository_1.CompleteProfileRepository.updateUserProfile(userId, {
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
            return await completeProfile_repository_1.CompleteProfileRepository.updateCompanyProfile(userId, {
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
exports.CompleteProfileService = CompleteProfileService;
//# sourceMappingURL=completeProfile.service.js.map