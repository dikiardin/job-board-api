"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const editProfile_controller_1 = require("../controllers/profile/editProfile.controller");
const verifyToken_1 = require("../middlewares/verifyToken");
const uploadImage_1 = require("../middlewares/uploadImage");
const profile_controller_1 = require("../controllers/profile/profile.controller");
class ProfileRouter {
    constructor() {
        this.route = (0, express_1.Router)();
        this.editProfileController = editProfile_controller_1.EditProfileController;
        this.profileController = profile_controller_1.ProfileController;
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.route.put("/edit", verifyToken_1.verifyToken, (0, uploadImage_1.uploadFields)([
            { name: "profilePicture", maxCount: 1 },
            { name: "logoUrl", maxCount: 1 },
            { name: "bannerUrl", maxCount: 1 },
        ]), this.editProfileController.editProfile);
        this.route.put("/complete", verifyToken_1.verifyToken, (0, uploadImage_1.uploadFields)([
            { name: "profilePicture", maxCount: 1 },
            { name: "logoUrl", maxCount: 1 },
        ]), this.editProfileController.completeProfile);
        this.route.get("/user", verifyToken_1.verifyToken, this.profileController.getUserProfile);
        this.route.get("/admin", verifyToken_1.verifyToken, this.profileController.getCompanyProfile);
    }
    getRouter() {
        return this.route;
    }
}
exports.default = ProfileRouter;
