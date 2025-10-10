import { Router } from "express";
import { ContactController } from "../controllers/contact/contact.controller";

class ContactRouter {
  private route: Router;
  private contactController: typeof ContactController;

  constructor() {
    this.route = Router();
    this.contactController = ContactController;
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.route.post("/developer", this.contactController.sendContact);
  }

  public getRouter(): Router {
    return this.route;
  }
}

export default ContactRouter;
