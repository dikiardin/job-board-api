import express from 'express';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import InterviewRouter from '../routers/interview.router';

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

const signAdmin = () => jwt.sign({ userId: 999, role: 'ADMIN', email: 'admin@example.com' }, process.env.JWT_SECRET || 'supersecretkey');

describe('API: GET /interview/companies/:companyId/interviews', () => {
  const app = express();
  app.use(express.json());
  app.use('/interview', new (InterviewRouter as any)().getRouter());

  it('returns interviews mapped with candidateName and jobTitle', async () => {
    const token = signAdmin();
    const res = await request(app)
      .get('/interview/companies/1/interviews?limit=10&offset=0')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    const item = res.body?.data?.items?.[0];
    expect(item.candidateName).toBe('Alice');
    expect(item.jobTitle).toBe('Senior Frontend Engineer');
  });
});

