"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactRepository = void 0;
class ContactRepository {
    static async saveContact(name, email, message) {
        // You could store this in a DB in the future
        return { name, email, message, createdAt: new Date() };
    }
}
exports.ContactRepository = ContactRepository;
//# sourceMappingURL=contact.repository.js.map