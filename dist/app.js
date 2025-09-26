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
const cv_router_1 = __importDefault(require("./routers/cv.router"));
const interview_router_1 = __importDefault(require("./routers/interview.router"));
const interviewJobs_1 = require("./jobs/interviewJobs");
const analytics_router_1 = __importDefault(require("./routers/analytics.router"));
const completeProfile_router_1 = __importDefault(require("./routers/completeProfile.router"));
const PORT = process.env.PORT || "5000";
class App {
    constructor() {
        this.app = (0, express_1.default)();
        this.configure();
        this.route();
        this.errorHandling();
    }
    configure() {
        this.app.use((req, res, next) => {
            console.log(`[${req.method}] ${req.url} - Origin: ${req.headers.origin}`);
            next();
        });
        this.app.use((0, cors_1.default)({
            origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
            methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
            credentials: true,
        }));
        this.app.use(express_1.default.json());
    }
    route() {
        this.app.get("/", (req, res) => {
            res.status(200).send("<h1>Job Board API</h1>");
        });
        const authRouter = new auth_router_1.default();
        const subscriptionRouter = new subscription_router_1.default();
        const preselectionRouter = new preselection_router_1.default();
        const applicationRouter = new application_router_1.default();
        const jobRouter = new job_router_1.default();
        const interviewRouter = new interview_router_1.default();
        const analyticsRouter = new analytics_router_1.default();
        const completeProfileRouter = new completeProfile_router_1.default();
        this.app.use("/auth", authRouter.getRouter());
        this.app.use("/subscription", subscriptionRouter.getRouter());
        this.app.use("/preselection", preselectionRouter.getRouter());
        this.app.use("/application", applicationRouter.getRouter());
        this.app.use("/job", jobRouter.getRouter());
        this.app.use("/cv", cv_router_1.default);
        this.app.use("/interview", interviewRouter.getRouter());
        this.app.use("/analytics", analyticsRouter.getRouter());
        this.app.use("/complete-profile", completeProfileRouter.getRouter());
    }
    errorHandling() {
        this.app.use((error, req, res, next) => {
            console.log("Global error handler:", error);
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
                    message: error.message,
                });
            }
            res.status(500).json({
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