"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const contact_controller_1 = require("../controllers/contact/contact.controller");
class ContactRouter {
    constructor() {
        this.route = (0, express_1.Router)();
        this.contactController = contact_controller_1.ContactController;
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.route.post("/developer", this.contactController.sendContact);
    }
    getRouter() {
        return this.route;
    }
}
exports.default = ContactRouter;
//# sourceMappingURL=contact.router.js.map