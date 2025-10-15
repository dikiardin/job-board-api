import { Application, PrismaClient } from "../../generated/prisma";
import { SeedUsersResult } from "./users";
import { SeedCompaniesResult } from "./companies";
interface SeedApplicationsOptions {
    prisma: PrismaClient;
    now: Date;
    addDays: (days: number) => Date;
    users: SeedUsersResult;
    companies: SeedCompaniesResult;
}
type ApplicationKey = "aliceFrontend" | "bobData" | "ginaUx" | "charlieProduct" | "dianaMarketing" | "ekoCustomerSuccess";
interface SeedApplicationsResult {
    applications: Record<ApplicationKey, Application>;
}
export declare function seedApplications({ prisma, now, addDays, users, companies, }: SeedApplicationsOptions): Promise<SeedApplicationsResult>;
export {};
//# sourceMappingURL=applications.d.ts.map