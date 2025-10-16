"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChangeEmailController = void 0;
const changeEmail_service_1 = require("../../services/auth/changeEmail.service");
class ChangeEmailController {
    static async changeEmail(req, res, next) {
        try {
            const userId = res.locals.decrypt.userId;
            const { newEmail } = req.body;
            if (!newEmail)
                return res.status(400).json({ message: "New email is required" });
            const result = await changeEmail_service_1.ChangeEmailService.changeEmail(userId, newEmail);
            res.status(200).json(result);
        }
        catch (err) {
            next(err);
        }
    }
}
exports.ChangeEmailController = ChangeEmailController;
