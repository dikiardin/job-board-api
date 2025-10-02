"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const supertest_1 = __importDefault(require("supertest"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const job_router_1 = __importDefault(require("../routers/job.router"));
jest.mock('../repositories/job/job.repository', () => ({
    JobRepository: {
        getCompany: jest.fn(async (companyId) => ({ id: companyId, adminId: 999 })),
        listJobs: jest.fn(async () => ({
            total: 1,
            limit: 10,
            offset: 0,
            items: [
                { id: 1, title: 'Senior Frontend Engineer', category: 'Engineering', city: 'Jakarta', isPublished: true, deadline: new Date(), createdAt: new Date(), _count: { applications: 3 } }
            ],
        })),
    }
}));
const signAdmin = () => jsonwebtoken_1.default.sign({ userId: 999, role: 'ADMIN', email: 'admin@example.com' }, process.env.JWT_SECRET || 'supersecretkey');
describe('API: GET /job/companies/:companyId/jobs', () => {
    const app = (0, express_1.default)();
    app.use(express_1.default.json());
    app.use('/job', new job_router_1.default().getRouter());
    it('returns jobs with applicantsCount and respects RBAC', async () => {
        const token = signAdmin();
        const res = await (0, supertest_1.default)(app)
            .get('/job/companies/1/jobs?limit=10&offset=0')
            .set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(200);
        expect(res.body?.data?.items?.[0]?.title).toBe('Senior Frontend Engineer');
        expect(res.body?.data?.items?.[0]?.applicantsCount).toBe(3);
    });
});
//# sourceMappingURL=api.jobs.test.js.map