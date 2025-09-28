"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const editProfile_controller_1 = require("../controllers/profile/editProfile.controller");
const verifyToken_1 = require("../middlewares/verifyToken");
const uploadImage_1 = require("../middlewares/uploadImage");
class ProfileRouter {
    constructor() {
        this.route = (0, express_1.Router)();
        this.editProfileController = editProfile_controller_1.EditProfileController;
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.route.put("/edit", verifyToken_1.verifyToken, (0, uploadImage_1.uploadFields)([
            { name: "profilePicture", maxCount: 1 },
            { name: "logo", maxCount: 1 },
        ]), this.editProfileController.editProfile);
    }
    getRouter() {
        return this.route;
    }
}
exports.default = ProfileRouter;
//# sourceMappingURL=profile.router.js.map