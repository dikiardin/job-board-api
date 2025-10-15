"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EditProfileController = void 0;
const editProfile_service_1 = require("../../services/profile/editProfile.service");
class EditProfileController {
    static async editProfile(req, res, next) {
        try {
            const decrypt = res.locals.decrypt;
            if (!decrypt) {
                return res.status(401).json({ message: "Unauthorized" });
            }
            const userId = decrypt.userId;
            const role = decrypt.role;
            const files = req.files;
            const logoFile = files?.logoUrl?.[0];
            const bannerFile = files?.bannerUrl?.[0];
            const profilePictureFile = files?.profilePicture?.[0];
            const updatedProfile = await editProfile_service_1.EditProfileService.editProfile(userId, role, req.body, { logoFile, bannerFile, profilePictureFile });
            res.status(200).json({
                message: "Profile completed successfully",
                data: updatedProfile,
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async completeProfile(req, res, next) {
        try {
            const { userId } = res.locals.decrypt;
            const files = req.files;
            const uploadedFile = (files?.profilePicture && files.profilePicture[0]) ||
                (files?.logoUrl && files.logoUrl[0]);
            const updatedProfile = await editProfile_service_1.EditProfileService.completeProfile(userId, req.body, uploadedFile);
            res.status(200).json({
                message: "Profile completed successfully",
                data: updatedProfile,
            });
        }
        catch (err) {
            next(err);
        }
    }
}
exports.EditProfileController = EditProfileController;
//# sourceMappingURL=editProfile.controller.js.map