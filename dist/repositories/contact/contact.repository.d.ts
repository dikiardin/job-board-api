export declare class ContactRepository {
    static saveContact(name: string, email: string, message: string): Promise<{
        name: string;
        email: string;
        message: string;
        createdAt: Date;
    }>;
}
//# sourceMappingURL=contact.repository.d.ts.map