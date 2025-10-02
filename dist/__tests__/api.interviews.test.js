"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const supertest_1 = __importDefault(require("supertest"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const interview_router_1 = __importDefault(require("../routers/interview.router"));
jest.mock('../config/prisma', () => ({
    prisma: {
        company: { findUnique: jest.fn(async () => ({ id: 1, adminId: 999 })) }
    }
}));
jest.mock('../repositories/interview/interview.repository', () => ({
    InterviewRepository: {
        list: jest.fn(async () => ({
            total: 1,
            limit: 10,
            offset: 0,
            items: [
                { id: 7, applicationId: 21, scheduleDate: new Date(), status: 'SCHEDULED', locationOrLink: 'Zoom', notes: null, application: { user: { name: 'Alice' }, job: { title: 'Senior Frontend Engineer' } } }
            ],
        })),
    }
}));
const signAdmin = () => jsonwebtoken_1.default.sign({ userId: 999, role: 'ADMIN', email: 'admin@example.com' }, process.env.JWT_SECRET || 'supersecretkey');
describe('API: GET /interview/companies/:companyId/interviews', () => {
    const app = (0, express_1.default)();
    app.use(express_1.default.json());
    app.use('/interview', new interview_router_1.default().getRouter());
    it('returns interviews mapped with candidateName and jobTitle', async () => {
        const token = signAdmin();
        const res = await (0, supertest_1.default)(app)
            .get('/interview/companies/1/interviews?limit=10&offset=0')
            .set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(200);
        const item = res.body?.data?.items?.[0];
        expect(item.candidateName).toBe('Alice');
        expect(item.jobTitle).toBe('Senior Frontend Engineer');
    });
});
//# sourceMappingURL=api.interviews.test.js.map