export class ContactRepository {
  static async saveContact(name: string, email: string, message: string) {
    // You could store this in a DB in the future
    console.log("Saving contact:", { name, email, message });
    return { name, email, message, createdAt: new Date() };
  }
}
