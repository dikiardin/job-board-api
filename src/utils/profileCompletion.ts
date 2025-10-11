import type { Company, User } from "../generated/prisma";

const hasValue = (value?: string | null) =>
  typeof value === "string" ? value.trim().length > 0 : value !== null && value !== undefined;

const isCompanyProfileComplete = (company?: Company | null) => {
  if (!company) return false;

  return (
    hasValue(company.phone) &&
    hasValue(company.address) &&
    hasValue(company.locationCity) &&
    hasValue(company.description) &&
    hasValue(company.website) &&
    hasValue(company.logoUrl)
  );
};

const isUserDetailsComplete = (user: User) =>
  hasValue(user.phone) &&
    hasValue(user.gender) &&
    !!user.dob &&
    hasValue(user.education) &&
    hasValue(user.address) &&
    hasValue(user.city);

export const resolveIsProfileComplete = (
  user: (User & { ownedCompany?: Company | null }) | null | undefined
) => {
  if (!user) return false;

  if (user.role === "ADMIN") {
    return (
      hasValue(user.phone) &&
      hasValue(user.address) &&
      hasValue(user.city) &&
      isCompanyProfileComplete(user.ownedCompany)
    );
  }

  return isUserDetailsComplete(user);
};
