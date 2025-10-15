import { Router } from "express";
declare class AuthRouter {
    private route;
    private basicAuthController;
    private socialAuthController;
    private keepLoginController;
    constructor();
    private initializeRoutes;
    getRouter(): Router;
}
export default AuthRouter;
//# sourceMappingURL=auth.router.d.ts.map