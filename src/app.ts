import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import express, { Application, NextFunction, Request, Response } from "express";

const PORT: string = process.env.PORT || "5000";

class App {
  public app: Application;

  constructor() {
    this.app = express();
    this.configure();
    this.route();
    this.errorHandling();
  }

  private configure(): void {
    this.app.use(
      cors({
        origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        credentials: false,
        allowedHeaders: ["Content-Type", "Authorization", "Accept"],
        exposedHeaders: ["Content-Type", "Authorization"],
        optionsSuccessStatus: 200,
      })
    );
    this.app.use(express.json());
  }

  private route(): void {
    this.app.get("/", (req: Request, res: Response) => {
      res.status(200).send("<h1>Job Board API</h1>");
    });

    // Example to add routers later (uncomment when available)
    // const authRouter = new AuthRouter();
    // this.app.use("/auth", authRouter.getRouter());
  }

  private errorHandling(): void {
    this.app.use(
      (error: any, req: Request, res: Response, next: NextFunction) => {
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
            success: false,
            message: error.message,
          });
        }

        res.status(500).json({
          success: false,
          message: "Internal server error",
        });
      }
    );
  }

  public start(): void {
    this.app.listen(PORT, () => {
      console.log(`API Running: http://localhost:${PORT}`);
      // start background jobs here when available
    });
  }
}

export default App;
