import { ApplicationService } from '../../application/application.service';

jest.mock('../../../repositories/application/application.repository', () => ({
  ApplicationRepo: {
    findExisting: jest.fn(),
    createApplication: jest.fn(async (data: any) => ({ id: 77, ...data })),
  }
}));

jest.mock('../../../repositories/preselection/preselection.repository', () => ({
  PreselectionRepository: {
    getTestByJobId: jest.fn(),
    getResult: jest.fn(),
  }
}));

jest.mock('../../../repositories/job/job.repository', () => ({
  JobRepository: {
    getJobPublic: jest.fn(),
  }
}));

jest.mock('../../../config/cloudinary', () => ({
  cloudinaryUpload: jest.fn(async (file: any) => ({ secure_url: 'https://cdn.example.com/cv.pdf' })),
}));

const { ApplicationRepo } = jest.requireMock('../../../repositories/application/application.repository');
const { PreselectionRepository } = jest.requireMock('../../../repositories/preselection/preselection.repository');
const { JobRepository } = jest.requireMock('../../../repositories/job/job.repository');

describe('ApplicationService.submitApplication', () => {
  const dummyFile = { originalname: 'cv.pdf', buffer: Buffer.from('abc') } as unknown as Express.Multer.File;

  beforeEach(() => {
    (ApplicationRepo.findExisting as jest.Mock).mockReset();
    (ApplicationRepo.createApplication as jest.Mock).mockReset();
    (PreselectionRepository.getTestByJobId as jest.Mock).mockReset();
    (PreselectionRepository.getResult as jest.Mock).mockReset();
    (JobRepository.getJobPublic as jest.Mock).mockReset();
  });

  it('rejects if job is not open', async () => {
    (JobRepository.getJobPublic as jest.Mock).mockResolvedValue(null);
    await expect(ApplicationService.submitApplication(2, 10, dummyFile)).rejects.toMatchObject({ message: expect.stringMatching(/not open/i) });
  });

  it('rejects duplicate application', async () => {
    (JobRepository.getJobPublic as jest.Mock).mockResolvedValue({ id: 10 });
    (ApplicationRepo.findExisting as jest.Mock).mockResolvedValue({ id: 1 });
    await expect(ApplicationService.submitApplication(2, 10, dummyFile)).rejects.toMatchObject({ message: expect.stringMatching(/already applied/i) });
  });

  it('enforces preselection when active and result missing', async () => {
    (JobRepository.getJobPublic as jest.Mock).mockResolvedValue({ id: 10 });
    (ApplicationRepo.findExisting as jest.Mock).mockResolvedValue(null);
    (PreselectionRepository.getTestByJobId as jest.Mock).mockResolvedValue({ id: 5, isActive: true, passingScore: 10 });
    (PreselectionRepository.getResult as jest.Mock).mockResolvedValue(null);
    await expect(ApplicationService.submitApplication(2, 10, dummyFile)).rejects.toMatchObject({ message: expect.stringMatching(/complete the pre-selection test/i) });
  });

  it('rejects when score below passing', async () => {
    (JobRepository.getJobPublic as jest.Mock).mockResolvedValue({ id: 10 });
    (ApplicationRepo.findExisting as jest.Mock).mockResolvedValue(null);
    (PreselectionRepository.getTestByJobId as jest.Mock).mockResolvedValue({ id: 5, isActive: true, passingScore: 10 });
    (PreselectionRepository.getResult as jest.Mock).mockResolvedValue({ score: 7 });
    await expect(ApplicationService.submitApplication(2, 10, dummyFile)).rejects.toMatchObject({ message: expect.stringMatching(/does not meet the passing/i) });
  });

  it('creates application when no test or passed', async () => {
    (JobRepository.getJobPublic as jest.Mock).mockResolvedValue({ id: 10 });
    (ApplicationRepo.findExisting as jest.Mock).mockResolvedValue(null);
    (PreselectionRepository.getTestByJobId as jest.Mock).mockResolvedValue({ id: 5, isActive: true, passingScore: 10 });
    (PreselectionRepository.getResult as jest.Mock).mockResolvedValue({ score: 12 });
    await ApplicationService.submitApplication(2, 10, dummyFile, 20000000);
    expect(ApplicationRepo.createApplication).toHaveBeenCalledWith(expect.objectContaining({
      userId: 2,
      jobId: 10,
      cvFile: expect.stringContaining('https://'),
      expectedSalary: 20000000,
    }));
  });
});
