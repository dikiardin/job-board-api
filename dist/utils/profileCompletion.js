"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveIsProfileComplete = void 0;
const hasValue = (value) => typeof value === "string" ? value.trim().length > 0 : value !== null && value !== undefined;
const isCompanyProfileComplete = (company) => {
    if (!company)
        return false;
    return (hasValue(company.phone) &&
        hasValue(company.address) &&
        hasValue(company.locationCity) &&
        hasValue(company.description) &&
        hasValue(company.website) &&
        hasValue(company.logoUrl));
};
const isUserDetailsComplete = (user) => hasValue(user.phone) &&
    hasValue(user.gender) &&
    !!user.dob &&
    hasValue(user.education) &&
    hasValue(user.address) &&
    hasValue(user.city);
const resolveIsProfileComplete = (user) => {
    if (!user)
        return false;
    if (user.role === "ADMIN") {
        return (hasValue(user.phone) &&
            hasValue(user.address) &&
            hasValue(user.city) &&
            isCompanyProfileComplete(user.ownedCompany));
    }
    return isUserDetailsComplete(user);
};
exports.resolveIsProfileComplete = resolveIsProfileComplete;
