"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const supertest_1 = __importDefault(require("supertest"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const analytics_router_1 = __importDefault(require("../routers/analytics.router"));
jest.mock('../repositories/analytics/analytics.repository', () => ({
    AnalyticsRepository: {
        getCompany: jest.fn(async (companyId) => ({ id: companyId, adminId: 999 })),
        getCompanyApplications: jest.fn(async () => ([{ user: { gender: 'Male', dob: new Date('1995-06-15') }, job: { city: 'Jakarta' } }])),
        expectedSalaryByCityAndTitle: jest.fn(async () => ([{ city: 'Jakarta', title: 'Engineer', avgExpectedSalary: 15000000, samples: 3 }])),
        companyReviewSalaryStats: jest.fn(async () => ({ avgSalaryEstimate: 20000000, samples: 5 })),
        applicationsByCategory: jest.fn(async () => ([{ category: 'Engineering', count: 10 }])),
        topCitiesByApplications: jest.fn(async () => ([{ city: 'Jakarta', count: 10 }])),
        applicationStatusCounts: jest.fn(async () => ([{ status: 'SUBMITTED', _count: { status: 10 } }]))
    }
}));
jest.mock('../config/prisma', () => ({
    prisma: {
        user: { count: jest.fn(async () => 100) },
        job: { count: jest.fn(async () => 5) },
        application: { count: jest.fn(async () => 20) },
    }
}));
const signAdmin = () => jsonwebtoken_1.default.sign({ userId: 999, role: 'ADMIN', email: 'admin@example.com' }, process.env.JWT_SECRET || 'supersecretkey');
describe('API: /analytics/companies/:companyId/*', () => {
    const app = (0, express_1.default)();
    app.use(express_1.default.json());
    app.use('/analytics', new analytics_router_1.default().getRouter());
    it('demographics returns ageBuckets, gender map and locations', async () => {
        const token = signAdmin();
        const res = await (0, supertest_1.default)(app)
            .get('/analytics/companies/1/analytics/demographics')
            .set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(200);
        expect(res.body?.data?.totalApplicants).toBe(1);
    });
    it('salary-trends returns expected and review stats', async () => {
        const token = signAdmin();
        const res = await (0, supertest_1.default)(app)
            .get('/analytics/companies/1/analytics/salary-trends')
            .set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(200);
        expect(res.body?.data?.expectedSalary?.[0]?.city).toBe('Jakarta');
    });
    it('interests returns byCategory', async () => {
        const token = signAdmin();
        const res = await (0, supertest_1.default)(app)
            .get('/analytics/companies/1/analytics/interests')
            .set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(200);
        expect(res.body?.data?.byCategory?.[0]?.category).toBe('Engineering');
    });
    it('overview returns totals and top cities', async () => {
        const token = signAdmin();
        const res = await (0, supertest_1.default)(app)
            .get('/analytics/companies/1/analytics/overview')
            .set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(200);
        expect(res.body?.data?.totals?.usersTotal).toBe(100);
    });
});
//# sourceMappingURL=api.analytics.test.js.map