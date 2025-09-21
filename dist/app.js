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
const PORT = process.env.PORT || "5000";
class App {
    constructor() {
        this.app = (0, express_1.default)();
        this.configure();
        this.route();
        this.errorHandling();
        this.startBackgroundJobs();
    }
    configure() {
        this.app.use((0, cors_1.default)({
            origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
            methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
            credentials: false,
            allowedHeaders: ["Content-Type", "Authorization", "Accept"],
            exposedHeaders: ["Content-Type", "Authorization"],
            optionsSuccessStatus: 200,
        }));
        this.app.use(express_1.default.json());
    }
    route() {
        this.app.get("/", (req, res) => {
            res.status(200).send("<h1>Job Board API</h1>");
        });
        const authRouter = new auth_router_1.default();
        this.app.use("/auth", authRouter.getRouter());
        const subscriptionRouter = new subscription_router_1.default();
        this.app.use("/subscription", subscriptionRouter.getRouter());
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
    startBackgroundJobs() {
        subscriptionJobs_1.SubscriptionJobs.startAllJobs();
    }
    start() {
        this.app.listen(PORT, () => {
            console.log(`API Running: http://localhost:${PORT}`);
        });
    }
}
exports.default = App;
//# sourceMappingURL=app.js.map