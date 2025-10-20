"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseListQuery = parseListQuery;
exports.parsePublicListQuery = parsePublicListQuery;
exports.parseApplicantsQuery = parseApplicantsQuery;
function parseListQuery(req) {
    const source = req.res?.locals?.validatedQuery || req.query;
    const { title, category, sortBy, sortOrder, limit, offset } = source || {};
    const q = {};
    if (typeof title === "string")
        q.title = title;
    if (typeof category === "string")
        q.category = category;
    if (sortBy === "createdAt" || sortBy === "deadline")
        q.sortBy = sortBy;
    if (sortOrder === "asc" || sortOrder === "desc")
        q.sortOrder = sortOrder;
    if (typeof limit === "string" && limit.trim() !== "")
        q.limit = Number(limit);
    if (typeof offset === "string" && offset.trim() !== "")
        q.offset = Number(offset);
    return q;
}
function parsePublicListQuery(req) {
    const { title, category, city, sortBy, sortOrder, limit, offset } = req.query;
    const q = {};
    if (typeof title === "string")
        q.title = title;
    if (typeof category === "string")
        q.category = category;
    if (typeof city === "string")
        q.city = city;
    if (sortBy === "createdAt" || sortBy === "deadline")
        q.sortBy = sortBy;
    if (sortOrder === "asc" || sortOrder === "desc")
        q.sortOrder = sortOrder;
    if (typeof limit === "string" && limit.trim() !== "")
        q.limit = Number(limit);
    if (typeof offset === "string" && offset.trim() !== "")
        q.offset = Number(offset);
    return q;
}
function parseApplicantsQuery(raw) {
    const { name, education, ageMin, ageMax, expectedSalaryMin, expectedSalaryMax, sortBy, sortOrder, limit, offset } = raw;
    const q = {};
    if (typeof name === "string")
        q.name = name;
    if (typeof education === "string")
        q.education = education;
    if (typeof ageMin === "string" && ageMin.trim() !== "") {
        const age = Number(ageMin);
        if (age < 0)
            return { error: { status: 400, message: "Age minimum cannot be negative" } };
        q.ageMin = age;
    }
    if (typeof ageMax === "string" && ageMax.trim() !== "") {
        const age = Number(ageMax);
        if (age < 0)
            return { error: { status: 400, message: "Age maximum cannot be negative" } };
        q.ageMax = age;
    }
    if (typeof expectedSalaryMin === "string" && expectedSalaryMin.trim() !== "")
        q.expectedSalaryMin = Number(expectedSalaryMin);
    if (typeof expectedSalaryMax === "string" && expectedSalaryMax.trim() !== "")
        q.expectedSalaryMax = Number(expectedSalaryMax);
    if (sortBy === "appliedAt" || sortBy === "expectedSalary" || sortBy === "age")
        q.sortBy = sortBy;
    if (sortOrder === "asc" || sortOrder === "desc")
        q.sortOrder = sortOrder;
    if (typeof limit === "string" && limit.trim() !== "") {
        const limitNum = Number(limit);
        if (limitNum < 0)
            return { error: { status: 400, message: "Limit cannot be negative" } };
        const MAX_LIMIT = 100;
        q.limit = Math.min(limitNum, MAX_LIMIT);
    }
    if (typeof offset === "string" && offset.trim() !== "") {
        const offsetNum = Number(offset);
        if (offsetNum < 0)
            return { error: { status: 400, message: "Offset cannot be negative" } };
        q.offset = offsetNum;
    }
    return { query: q };
}
