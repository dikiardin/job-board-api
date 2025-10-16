"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactController = void 0;
const contact_service_1 = require("../../services/contact/contact.service");
class ContactController {
    static async sendContact(req, res, next) {
        try {
            const { name, email, message } = req.body;
            if (!name || !email || !message) {
                return res.status(400).json({ error: "All fields are required." });
            }
            const result = await contact_service_1.ContactService.sendContactEmail(name, email, message);
            res.status(200).json(result);
        }
        catch (err) {
            next(err);
        }
    }
}
exports.ContactController = ContactController;
