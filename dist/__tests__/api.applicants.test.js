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
        listApplicantsForJob: jest.fn(async () => ({
            total: 1,
            limit: 10,
            offset: 0,
            items: [
                { id: 21, createdAt: new Date(), expectedSalary: 20000000, status: 'SUBMITTED', cvFile: 'https://cv', userId: 2, user: { id: 2, name: 'Alice', email: 'alice@example.com', profilePicture: null, education: 'S1', dob: new Date('1997-01-01') } }
            ],
        })),
    }
}));
jest.mock('../repositories/preselection/preselection.repository', () => ({
    PreselectionRepository: {
        getTestByJobId: jest.fn(async () => ({ id: 5, passingScore: 20 })),
        getResultsByTestAndUsers: jest.fn(async () => ([{ userId: 2, score: 22 }]))
    }
}));
const signAdmin = () => jsonwebtoken_1.default.sign({ userId: 999, role: 'ADMIN', email: 'admin@example.com' }, process.env.JWT_SECRET || 'supersecretkey');
describe('API: GET /job/companies/:companyId/jobs/:jobId/applicants', () => {
    const app = (0, express_1.default)();
    app.use(express_1.default.json());
    app.use('/job', new job_router_1.default().getRouter());
    it('returns applicants with preselection score mapping', async () => {
        const token = signAdmin();
        const res = await (0, supertest_1.default)(app)
            .get('/job/companies/1/jobs/10/applicants?limit=10&offset=0')
            .set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(200);
        const item = res.body?.data?.items?.[0];
        expect(item.user.name).toBe('Alice');
        expect(item.testScore).toBe(22);
        expect(item.preselectionPassed).toBe(true);
    });
});
//# sourceMappingURL=api.applicants.test.js.map