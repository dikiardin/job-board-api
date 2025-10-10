import { Request, Response, NextFunction } from "express";
import { ContactService } from "../../services/contact/contact.service";

export class ContactController {
  static async sendContact(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, email, message } = req.body;

      if (!name || !email || !message) {
        return res.status(400).json({ error: "All fields are required." });
      }

      const result = await ContactService.sendContactEmail(name, email, message);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  }
}
