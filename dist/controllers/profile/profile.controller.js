"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileController = void 0;
const profile_service_1 = require("../../services/profile/profile.service");
class ProfileController {
    static async getUserProfile(req, res, next) {
        try {
            const decrypt = res.locals.decrypt;
            if (!decrypt)
                return res.status(401).json({ message: "Unauthorized" });
            const user = await profile_service_1.ProfileService.getUserProfile(decrypt.userId);
            res.status(200).json({ message: "User profile fetched", data: user });
        }
        catch (error) {
            next(error);
        }
    }
    static async getCompanyProfile(req, res, next) {
        try {
            const decrypt = res.locals.decrypt;
            if (!decrypt)
                return res.status(401).json({ message: "Unauthorized" });
            const company = await profile_service_1.ProfileService.getCompanyProfile(decrypt.userId);
            res.status(200).json({ message: "Company profile fetched", data: company });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.ProfileController = ProfileController;
