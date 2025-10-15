"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
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
const contact_router_1 = __importDefault(require("./routers/contact.router"));
const PORT = process.env.PORT || "5000";
class App {
    constructor() {
        this.app = (0, express_1.default)();
        this.configure();
        this.route();
        this.errorHandling();
    }
    configure() {
        // Security headers - DISABLED FOR TESTING
        // this.app.use(
        //   helmet({
        //     contentSecurityPolicy: {
        //       directives: {
        //         defaultSrc: ["'self'"],
        //         styleSrc: ["'self'", "'unsafe-inline'"],
        //         scriptSrc: ["'self'"],
        //         imgSrc: ["'self'", "data:", "https:"],
        //       },
        //     },
        //     crossOriginEmbedderPolicy: false,
        //   })
        // );
        // Request logging (development only)
        if (process.env.NODE_ENV !== "production") {
            this.app.use((req, res, next) => {
                console.log(`[${req.method}] ${req.url} - Origin: ${req.headers.origin}`);
                next();
            });
        }
        // CORS configuration - SIMPLIFIED LIKE EVENT-MANAGEMENT-API
        this.app.use((0, cors_1.default)({
            origin: [
                "http://localhost:3000",
                "http://127.0.0.1:3000",
                "https://job-board-app-xi.vercel.app",
                ...(process.env.FE_URL ? [process.env.FE_URL] : []),
            ],
            methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
            credentials: true,
            allowedHeaders: ["Content-Type", "Authorization", "Accept"],
            exposedHeaders: ["Content-Type", "Authorization"],
            optionsSuccessStatus: 200,
        }));
        // Body parsing with limits
        this.app.use(express_1.default.json({ limit: "10mb" }));
        this.app.use(express_1.default.urlencoded({ extended: true, limit: "10mb" }));
    }
    route() {
        // Health check endpoint
        this.app.get("/", (req, res) => {
            res.status(200).json({
                success: true,
                message: "Job Board API is running",
                timestamp: new Date().toISOString(),
                version: "1.0.0",
            });
        });
        // Health check endpoint for monitoring
        this.app.get("/health", async (req, res) => {
            try {
                // Test database connection
                await prisma_1.prisma.$queryRaw `SELECT 1`;
                res.status(200).json({
                    success: true,
                    status: "healthy",
                    database: "connected",
                    timestamp: new Date().toISOString(),
                });
            }
            catch (error) {
                res.status(503).json({
                    success: false,
                    status: "unhealthy",
                    database: "disconnected",
                    error: error.message,
                    timestamp: new Date().toISOString(),
                });
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
        const contactRouter = new contact_router_1.default();
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
        this.app.use("/contact", contactRouter.getRouter());
    }
    errorHandling() {
        this.app.use((error, req, res, next) => {
            console.log("Global error handler:", error);
            // Handle JWT errors
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
            if (error.status) {
                return res.status(error.status).json({
                    success: false,
                    message: error.message,
                });
            }
            res.status(500).json({
                success: false,
                message: "Internal server error",
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