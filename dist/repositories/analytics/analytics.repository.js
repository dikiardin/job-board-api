"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsRepository = void 0;
const prisma_1 = require("../../config/prisma");
const Platform = __importStar(require("./analytics.platform.repository"));
const Company = __importStar(require("./analytics.company.repository"));
class AnalyticsRepository {
    static async getCompany(companyId) {
        const id = typeof companyId === 'string' ? Number(companyId) : companyId;
        return prisma_1.prisma.company.findUnique({ where: { id } });
    }
    // Platform-wide methods
    static async getAllUsers(params) {
        return Platform.getAllUsers(params);
    }
    static async getAllApplications(params) {
        return Platform.getAllApplications(params);
    }
    static async getAllCompanies() {
        return Platform.getAllCompanies();
    }
    static async platformSalaryTrends(params) {
        return Platform.platformSalaryTrends(params);
    }
    static async platformReviewSalaryStats() {
        return Platform.platformReviewSalaryStats();
    }
    static async platformJobCategories(params) {
        return Platform.platformJobCategories(params);
    }
    static async platformApplicationStatusCounts(params) {
        return Platform.platformApplicationStatusCounts(params);
    }
    static async platformTopCities(params) {
        return Platform.platformTopCities(params);
    }
    static async platformDailyActiveUsers(params) {
        return Platform.platformDailyActiveUsers(params);
    }
    static async platformMonthlyActiveUsers(params) {
        return Platform.platformMonthlyActiveUsers(params);
    }
    static async platformSessionMetrics(params) {
        return Platform.platformSessionMetrics(params);
    }
    static async platformPageViews(params) {
        return Platform.platformPageViews(params);
    }
    static async platformConversionFunnelData(params) {
        return Platform.platformConversionFunnelData(params);
    }
    static async platformRetentionData(params) {
        return Platform.platformRetentionData(params);
    }
    static async platformPerformanceData(params) {
        return Platform.platformPerformanceData(params);
    }
    // Company-scoped methods remain inline
    static async getCompanyApplications(params) { return Company.getCompanyApplications(params); }
    static async applicationStatusCounts(params) { return Company.applicationStatusCounts(params); }
    static async applicationsByCategory(params) { return Company.applicationsByCategory(params); }
    static async expectedSalaryByCityAndTitle(params) { return Company.expectedSalaryByCityAndTitle(params); }
    static async topCitiesByApplications(params) { return Company.topCitiesByApplications(params); }
    static async companyReviewSalaryStats(companyId) { return Company.companyReviewSalaryStats(companyId); }
    static async dailyActiveUsers(params) { return Company.dailyActiveUsers(params); }
    static async monthlyActiveUsers(params) { return Company.monthlyActiveUsers(params); }
    static async sessionMetrics(params) { return Company.sessionMetrics(params); }
    static async pageViews(params) { return Company.pageViews(params); }
    static async conversionFunnelData(params) { return Company.conversionFunnelData(params); }
    static async retentionData(params) { return Company.retentionData(params); }
    static async performanceData(params) { return Company.performanceData(params); }
}
exports.AnalyticsRepository = AnalyticsRepository;
