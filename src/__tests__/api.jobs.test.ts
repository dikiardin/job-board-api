import express from 'express';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import JobRouter from '../routers/job.router';

jest.mock('../repositories/job/job.repository', () => ({
  JobRepository: {
    getCompany: jest.fn(async (companyId: number) => ({ id: companyId, adminId: 999 })),
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

const signAdmin = () => jwt.sign({ userId: 999, role: 'ADMIN', email: 'admin@example.com' }, process.env.JWT_SECRET || 'supersecretkey');

describe('API: GET /job/companies/:companyId/jobs', () => {
  const app = express();
  app.use(express.json());
  app.use('/job', new (JobRouter as any)().getRouter());

  it('returns jobs with applicantsCount and respects RBAC', async () => {
    const token = signAdmin();
    const res = await request(app)
      .get('/job/companies/1/jobs?limit=10&offset=0')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body?.data?.items?.[0]?.title).toBe('Senior Frontend Engineer');
    expect(res.body?.data?.items?.[0]?.applicantsCount).toBe(3);
  });
});

