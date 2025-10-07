"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const auth_router_1 = __importDefault(require("./routers/auth.router"));
const subscription_router_1 = __importDefault(require("./routers/subscription.router"));
const subscriptionJobs_1 = require("./jobs/subscriptionJobs");
const preselection_router_1 = __importDefault(require("./routers/preselection.router"));
const application_router_1 = __importDefault(require("./routers/application.router"));
const job_router_1 = __importDefault(require("./routers/job.router"));
const interview_router_1 = __importDefault(require("./routers/interview.router"));
const interviewJobs_1 = require("./jobs/interviewJobs");
const analytics_router_1 = __importDefault(require("./routers/analytics.router"));
const profile_router_1 = __importDefault(require("./routers/profile.router"));
const company_router_1 = __importDefault(require("./routers/company.router"));
const companyReview_router_1 = __importDefault(require("./routers/companyReview.router"));
const skillAssessment_router_1 = __importDefault(require("./routers/skillAssessment.router"));
const prisma_1 = require("./config/prisma");
const share_router_1 = __importDefault(require("./routers/share.router"));
const save_router_1 = __importDefault(require("./routers/save.router"));
const cv_router_1 = __importDefault(require("./routers/cv.router"));
const PORT = process.env.PORT || "5000";
class App {
    constructor() {
        this.app = (0, express_1.default)();
        this.configure();
        this.route();
        this.errorHandling();
    }
    configure() {
        // Security headers
        this.app.use((0, helmet_1.default)({
            contentSecurityPolicy: {
                directives: {
                    defaultSrc: ["'self'"],
                    styleSrc: ["'self'", "'unsafe-inline'"],
                    scriptSrc: ["'self'"],
                    imgSrc: ["'self'", "data:", "https:"],
                },
            },
            crossOriginEmbedderPolicy: false
        }));
        // Request logging (development only)
        if (process.env.NODE_ENV !== 'production') {
            this.app.use((req, res, next) => {
                console.log(`[${req.method}] ${req.url} - Origin: ${req.headers.origin}`);
                next();
            });
        }
        // CORS configuration
        const devOrigins = new Set([process.env.FE_URL, "http://localhost:3000", "http://localhost:3001", "http://127.0.0.1:3000"].filter(Boolean));
        this.app.use((0, cors_1.default)({
            origin: (origin, callback) => {
                // Allow server-to-server or tools with no origin
                if (!origin)
                    return callback(null, true);
                if (process.env.NODE_ENV === "production") {
                    const allowed = ["https://yourdomain.com", process.env.FE_URL].filter(Boolean);
                    return allowed.includes(origin)
                        ? callback(null, true)
                        : callback(new Error(`CORS blocked for origin: ${origin}`));
                }
                // Development: optionally allow file:// (Origin: null) and common localhost variants
                if (origin === "null")
                    return callback(null, true);
                return devOrigins.has(origin)
                    ? callback(null, true)
                    : callback(new Error(`CORS blocked for origin: ${origin}`));
            },
            methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
            credentials: true,
            allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
            optionsSuccessStatus: 204,
        }));
        // Body parsing with limits
        this.app.use(express_1.default.json({ limit: '10mb' }));
        this.app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
    }
    route() {
        this.app.get("/", (req, res) => {
            res.status(200).send("<h1>Job Board API</h1>");
        });
        this.app.get("/test-db", async (req, res) => {
            try {
                const company = await prisma_1.prisma.company.findFirst();
                res.status(200).json({ success: true, company });
            }
            catch (error) {
                res.status(500).json({ success: false, error: error.message });
            }
        });
        this.app.get("/test-jobs/:companyId", async (req, res) => {
            try {
                const companyId = Number(req.params.companyId);
                const jobs = await prisma_1.prisma.job.findMany({ where: { companyId } });
                const company = await prisma_1.prisma.company.findUnique({ where: { id: companyId } });
                res.status(200).json({ success: true, company, jobs });
            }
            catch (error) {
                res.status(500).json({ success: false, error: error.message });
            }
        });
        this.app.post("/test-create-job", async (req, res) => {
            try {
                const job = await prisma_1.prisma.job.create({
                    data: {
                        companyId: 16,
                        title: "Senior Frontend Developer",
                        description: "We are looking for a senior frontend developer with React experience",
                        category: "Engineering",
                        city: "Jakarta",
                        salaryMin: 15000000,
                        salaryMax: 25000000,
                        tags: ["React", "TypeScript", "Node.js"],
                        isPublished: true,
                    }
                });
                res.status(200).json({ success: true, job });
            }
            catch (error) {
                res.status(500).json({ success: false, error: error.message });
            }
        });
        this.app.get("/test-job-service", async (req, res) => {
            try {
                const { JobService } = await Promise.resolve().then(() => __importStar(require("./services/job/job.service")));
                const data = await JobService.listJobs({
                    companyId: 16,
                    requesterId: 77,
                    requesterRole: "ADMIN",
                    query: { limit: 5, offset: 0 }
                });
                res.status(200).json({ success: true, data });
            }
            catch (error) {
                res.status(500).json({ success: false, error: error.message, stack: error.stack });
            }
        });
        this.app.get("/test-job-controller", async (req, res) => {
            try {
                const { JobController } = await Promise.resolve().then(() => __importStar(require("./controllers/job/job.controller")));
                const mockReq = {
                    params: { companyId: 16 },
                    query: { limit: "5", offset: "0" }
                };
                const mockRes = {
                    status: (code) => ({
                        json: (data) => res.status(code).json(data)
                    }),
                    locals: { decrypt: { userId: 77, role: "ADMIN" } }
                };
                const mockNext = (error) => {
                    if (error) {
                        res.status(500).json({ success: false, error: error.message, stack: error.stack });
                    }
                };
                await JobController.list(mockReq, mockRes, mockNext);
            }
            catch (error) {
                res.status(500).json({ success: false, error: error.message, stack: error.stack });
            }
        });
        this.app.get("/test-simple-jobs", async (req, res) => {
            try {
                const jobs = await prisma_1.prisma.job.findMany({
                    where: { companyId: 16 },
                    include: {
                        _count: { select: { applications: true } }
                    }
                });
                res.status(200).json({ success: true, jobs });
            }
            catch (error) {
                res.status(500).json({ success: false, error: error.message, stack: error.stack });
            }
        });
        this.app.post("/test-create-certificate", async (req, res) => {
            try {
                // Create a test certificate with proper certificate code and PDF URL
                const certificateCode = `CERT-TEST-${Date.now()}`;
                const pdfUrl = `${process.env.BE_URL || 'http://localhost:4400'}/test-generate-pdf/${certificateCode}`;
                // Ensure test user exists
                const testUser = await prisma_1.prisma.user.upsert({
                    where: { email: 'bob@example.com' },
                    update: {},
                    create: {
                        name: 'Bob Pratama',
                        email: 'bob@example.com',
                        role: 'USER'
                    }
                });
                // Ensure test assessment exists
                const testAssessment = await prisma_1.prisma.skillAssessment.upsert({
                    where: { id: 1 },
                    update: {},
                    create: {
                        title: 'Quick Test Assessment',
                        description: '2-question assessment for testing purposes. Perfect for quick validation of the assessment system.',
                        category: 'Testing',
                        createdBy: testUser.id
                    }
                });
                const certificate = await prisma_1.prisma.skillResult.create({
                    data: {
                        userId: testUser.id,
                        assessmentId: testAssessment.id,
                        score: 85,
                        isPassed: true,
                        certificateCode: certificateCode,
                        certificateUrl: pdfUrl, // Point to our PDF generation endpoint
                        startedAt: new Date(),
                        finishedAt: new Date(),
                    },
                    include: {
                        user: { select: { id: true, name: true, email: true } },
                        assessment: { select: { id: true, title: true, description: true, category: true } },
                    }
                });
                res.status(200).json({
                    success: true,
                    certificate,
                    qrCodeUrl: `${process.env.FE_URL || 'http://localhost:3000'}/verify-certificate/${certificateCode}`,
                    pdfViewUrl: `${process.env.BE_URL || 'http://localhost:4400'}/skill-assessment/certificates/${certificateCode}/view`,
                    message: `Test certificate created. View PDF at: ${process.env.BE_URL || 'http://localhost:4400'}/skill-assessment/certificates/${certificateCode}/view`
                });
            }
            catch (error) {
                res.status(500).json({ success: false, error: error.message, stack: error.stack });
            }
        });
        this.app.get("/test-generate-pdf/:certificateCode", async (req, res) => {
            try {
                const { certificateCode } = req.params;
                const { PDFLayoutService } = await Promise.resolve().then(() => __importStar(require("./services/skillAssessment/pdfLayout.service")));
                // Generate test PDF with QR code
                const pdfBuffer = await PDFLayoutService.generateCertificatePDF({
                    userName: "John Doe",
                    userEmail: "john.doe@example.com",
                    assessmentTitle: "JavaScript Fundamentals",
                    assessmentDescription: "Basic JavaScript programming concepts",
                    score: 85,
                    totalQuestions: 25,
                    completedAt: new Date(),
                    userId: 1,
                    certificateCode: certificateCode || "CERT-TEST-DEFAULT",
                    badgeIcon: "🏆"
                });
                res.setHeader('Content-Type', 'application/pdf');
                res.setHeader('Content-Disposition', `attachment; filename="certificate-${certificateCode}.pdf"`);
                res.send(pdfBuffer);
            }
            catch (error) {
                res.status(500).json({ success: false, error: error.message, stack: error.stack });
            }
        });
        const authRouter = new auth_router_1.default();
        const subscriptionRouter = new subscription_router_1.default();
        const preselectionRouter = new preselection_router_1.default();
        const applicationRouter = new application_router_1.default();
        const jobRouter = new job_router_1.default();
        const interviewRouter = new interview_router_1.default();
        const analyticsRouter = new analytics_router_1.default();
        const profileRouter = new profile_router_1.default();
        const companyRouter = new company_router_1.default();
        const companyReviewRouter = new companyReview_router_1.default();
        const skillAssessmentRouter = new skillAssessment_router_1.default();
        const shareRouter = new share_router_1.default();
        const saveRouter = new save_router_1.default();
        this.app.use("/auth", authRouter.getRouter());
        this.app.use("/subscription", subscriptionRouter.getRouter());
        this.app.use("/preselection", preselectionRouter.getRouter());
        this.app.use("/application", applicationRouter.getRouter());
        this.app.use("/job", jobRouter.getRouter());
        this.app.use("/cv", cv_router_1.default);
        this.app.use("/interview", interviewRouter.getRouter());
        this.app.use("/analytics", analyticsRouter.getRouter());
        this.app.use("/profile", profileRouter.getRouter());
        this.app.use("/company", companyRouter.getRouter());
        this.app.use("/reviews", companyReviewRouter.getRouter());
        this.app.use("/skill-assessment", skillAssessmentRouter.getRouter());
        this.app.use("/share", shareRouter.getRouter());
        this.app.use("/save", saveRouter.getRouter());
    }
    errorHandling() {
        this.app.use((error, req, res, next) => {
            console.error("Global error handler:", error);
            // Don't leak error details in production
            const isDevelopment = process.env.NODE_ENV === 'development';
            if (error.name === "JsonWebTokenError") {
                return res
                    .status(401)
                    .json({ success: false, message: "Invalid token format" });
            }
            if (error.name === "TokenExpiredError") {
                return res
                    .status(401)
                    .json({ success: false, message: "Token has expired" });
            }
            if (error.name === "ValidationError") {
                return res.status(400).json({
                    success: false,
                    message: "Validation error",
                    errors: error.details?.map((d) => d.message) || [error.message]
                });
            }
            if (error.code === 'P2002') {
                return res.status(409).json({
                    success: false,
                    message: "Duplicate entry. This record already exists."
                });
            }
            if (error.status) {
                return res.status(error.status).json({
                    success: false,
                    message: error.message,
                    ...(isDevelopment && { stack: error.stack })
                });
            }
            res.status(500).json({
                success: false,
                message: isDevelopment ? error.message : "Internal server error",
                ...(isDevelopment && { stack: error.stack })
            });
        });
    }
    start() {
        this.app.listen(PORT, () => {
            console.log(`API Running: http://localhost:${PORT}`);
            (0, subscriptionJobs_1.startSubscriptionJobs)();
            (0, interviewJobs_1.startInterviewJobs)();
        });
    }
}
exports.default = App;
//# sourceMappingURL=app.js.map