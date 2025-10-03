"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const application_service_1 = require("../../application/application.service");
jest.mock('../../../repositories/application/application.repository', () => ({
    ApplicationRepo: {
        findExisting: jest.fn(),
        createApplication: jest.fn(async (data) => ({ id: 77, ...data })),
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
    cloudinaryUpload: jest.fn(async (file) => ({ secure_url: 'https://cdn.example.com/cv.pdf' })),
}));
const { ApplicationRepo } = jest.requireMock('../../../repositories/application/application.repository');
const { PreselectionRepository } = jest.requireMock('../../../repositories/preselection/preselection.repository');
const { JobRepository } = jest.requireMock('../../../repositories/job/job.repository');
describe('ApplicationService.submitApplication', () => {
    const dummyFile = { originalname: 'cv.pdf', buffer: Buffer.from('abc') };
    beforeEach(() => {
        ApplicationRepo.findExisting.mockReset();
        ApplicationRepo.createApplication.mockReset();
        PreselectionRepository.getTestByJobId.mockReset();
        PreselectionRepository.getResult.mockReset();
        JobRepository.getJobPublic.mockReset();
    });
    it('rejects if job is not open', async () => {
        JobRepository.getJobPublic.mockResolvedValue(null);
        await expect(application_service_1.ApplicationService.submitApplication(2, "job-10", dummyFile)).rejects.toMatchObject({ message: expect.stringMatching(/not open/i) });
    });
    it('rejects duplicate application', async () => {
        JobRepository.getJobPublic.mockResolvedValue({ id: 10 });
        ApplicationRepo.findExisting.mockResolvedValue({ id: 1 });
        await expect(application_service_1.ApplicationService.submitApplication(2, "job-10", dummyFile)).rejects.toMatchObject({ message: expect.stringMatching(/already applied/i) });
    });
    it('enforces preselection when active and result missing', async () => {
        JobRepository.getJobPublic.mockResolvedValue({ id: "job-10" });
        ApplicationRepo.findExisting.mockResolvedValue(null);
        PreselectionRepository.getTestByJobId.mockResolvedValue({ id: 5, isActive: true, passingScore: 10 });
        PreselectionRepository.getResult.mockResolvedValue(null);
        await expect(application_service_1.ApplicationService.submitApplication(2, "job-10", dummyFile)).rejects.toMatchObject({ message: expect.stringMatching(/complete the pre-selection test/i) });
    });
    it('rejects when score below passing', async () => {
        JobRepository.getJobPublic.mockResolvedValue({ id: "job-10" });
        ApplicationRepo.findExisting.mockResolvedValue(null);
        PreselectionRepository.getTestByJobId.mockResolvedValue({ id: 5, isActive: true, passingScore: 10 });
        PreselectionRepository.getResult.mockResolvedValue({ score: 7 });
        await expect(application_service_1.ApplicationService.submitApplication(2, "job-10", dummyFile)).rejects.toMatchObject({ message: expect.stringMatching(/does not meet the passing/i) });
    });
    it('creates application when no test or passed', async () => {
        JobRepository.getJobPublic.mockResolvedValue({ id: "job-10" });
        ApplicationRepo.findExisting.mockResolvedValue(null);
        PreselectionRepository.getTestByJobId.mockResolvedValue({ id: 5, isActive: true, passingScore: 10 });
        PreselectionRepository.getResult.mockResolvedValue({ score: 12 });
        await application_service_1.ApplicationService.submitApplication(2, "job-10", dummyFile, 20000000);
        expect(ApplicationRepo.createApplication).toHaveBeenCalledWith(expect.objectContaining({
            userId: 2,
            jobId: "job-10",
            cvFile: expect.stringContaining('https://'),
            expectedSalary: 20000000,
        }));
    });
});
//# sourceMappingURL=application.service.test.js.map