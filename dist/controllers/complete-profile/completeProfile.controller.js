"use strict";
// import { NextFunction, Request, Response } from "express";
// import { CompleteProfileService } from "../../services/complete-profile/completeProfile.service";
// import { v2 as cloudinary } from "cloudinary";
// import * as streamifier from "streamifier";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompleteProfileController = void 0;
const completeProfile_service_1 = require("../../services/complete-profile/completeProfile.service");
class CompleteProfileController {
    static async completeProfile(req, res, next) {
        try {
            const decrypt = res.locals.decrypt;
            if (!decrypt) {
                return res.status(401).json({ message: "Unauthorized" });
            }
            const userId = decrypt.userId;
            const role = decrypt.role;
            const files = req.files;
            const uploadedFile = (files.profilePicture && files.profilePicture[0]) ||
                (files.logo && files.logo[0]);
            if (!uploadedFile) {
                return res.status(400).json({ message: "No file uploaded" });
            }
            // Pass the Multer file directly to the service
            const updatedProfile = await completeProfile_service_1.CompleteProfileService.completeProfile(userId, role, req.body, uploadedFile);
            res.status(200).json({
                message: "Profile completed successfully",
                data: updatedProfile,
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.CompleteProfileController = CompleteProfileController;
//# sourceMappingURL=completeProfile.controller.js.map