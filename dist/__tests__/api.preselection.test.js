"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const preselection_router_1 = __importDefault(require("../routers/preselection.router"));
jest.mock('../repositories/preselection/preselection.repository', () => ({
    PreselectionRepository: {
        getTestByJobId: jest.fn(async (jobId) => ({
            id: 1,
            jobId,
            isActive: true,
            passingScore: 20,
            createdAt: new Date(),
            questions: [
                { id: 11, question: 'Q1', options: ['A', 'B', 'C', 'D'], answer: 'A' },
                { id: 12, question: 'Q2', options: ['A', 'B', 'C', 'D'], answer: 'B' },
            ],
        })),
    }
}));
describe('API: GET /preselection/jobs/:jobId/tests', () => {
    const app = (0, express_1.default)();
    app.use('/preselection', new preselection_router_1.default().getRouter());
    const sign = (payload) => jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET || 'supersecretkey');
    it('hides answers for anonymous/applicant by default', async () => {
        const res = await (0, supertest_1.default)(app).get('/preselection/jobs/123/tests');
        expect(res.status).toBe(200);
        expect(res.body?.data?.questions?.[0]?.answer).toBeUndefined();
    });
    it('shows answers for admin role', async () => {
        const token = sign({ userId: 1, role: 'ADMIN', email: 'admin@example.com' });
        const res = await (0, supertest_1.default)(app)
            .get('/preselection/jobs/123/tests')
            .set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(200);
        expect(res.body?.data?.questions?.[0]?.answer).toBeDefined();
    });
});
//# sourceMappingURL=api.preselection.test.js.map