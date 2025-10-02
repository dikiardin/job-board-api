import request from 'supertest';
import express from 'express';
import jwt from 'jsonwebtoken';
import PreselectionRouter from '../routers/preselection.router';

jest.mock('../repositories/preselection/preselection.repository', () => ({
  PreselectionRepository: {
    getTestByJobId: jest.fn(async (jobId: number) => ({
      id: 1,
      jobId,
      isActive: true,
      passingScore: 20,
      createdAt: new Date(),
      questions: [
        { id: 11, question: 'Q1', options: ['A','B','C','D'], answer: 'A' },
        { id: 12, question: 'Q2', options: ['A','B','C','D'], answer: 'B' },
      ],
    })),
  }
}));

describe('API: GET /preselection/jobs/:jobId/tests', () => {
  const app = express();
  app.use('/preselection', new PreselectionRouter().getRouter());

  const sign = (payload: any) => jwt.sign(payload, process.env.JWT_SECRET || 'supersecretkey');

  it('hides answers for anonymous/applicant by default', async () => {
    const res = await request(app).get('/preselection/jobs/123/tests');
    expect(res.status).toBe(200);
    expect(res.body?.data?.questions?.[0]?.answer).toBeUndefined();
  });

  it('shows answers for admin role', async () => {
    const token = sign({ userId: 1, role: 'ADMIN', email: 'admin@example.com' });
    const res = await request(app)
      .get('/preselection/jobs/123/tests')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body?.data?.questions?.[0]?.answer).toBeDefined();
  });
});
