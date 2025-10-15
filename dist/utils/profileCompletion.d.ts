import type { Company, User } from "../generated/prisma";
export declare const resolveIsProfileComplete: (user: (User & {
    ownedCompany?: Company | null;
}) | null | undefined) => boolean;
//# sourceMappingURL=profileCompletion.d.ts.map