import { Response } from "express";
import { cvService } from "../../services/cv/core/cv.service";
import { AuthRequest } from "../../middlewares/auth.middleware";

export class CVMainController {
  // Generate CV from user profile
  async generateCV(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const { templateType = "ats", additionalInfo } = req.body;

      const cv = await cvService.generateCV(
        userId,
        templateType,
        additionalInfo
      );

      res.status(201).json({
        message: "CV generated successfully",
        data: cv,
      });
    } catch (error) {
      console.error("Generate CV error:", error);
      res.status(500).json({
        message: "Failed to generate CV",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  // Get user's generated CVs
  async getUserCVs(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const cvs = await cvService.getUserCVs(userId as number);

      res.status(200).json({
        message: "CVs retrieved successfully",
        data: cvs,
      });
    } catch (error) {
      console.error("Get user CVs error:", error);
      res.status(500).json({
        message: "Failed to retrieve CVs",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  // Get specific CV by ID
  async getCVById(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id;
      const cvId = parseInt(req.params.id as string);

      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      if (isNaN(cvId)) {
        return res.status(400).json({ message: "Invalid CV ID" });
      }

      const cv = await cvService.getCVById(cvId, userId as number);

      if (!cv) {
        return res.status(404).json({ message: "CV not found" });
      }

      res.status(200).json({
        message: "CV retrieved successfully",
        data: cv,
      });
    } catch (error) {
      console.error("Get CV by ID error:", error);
      res.status(500).json({
        message: "Failed to retrieve CV",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  // Update CV
  async updateCV(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id;
      const cvId = parseInt(req.params.id as string);

      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      if (isNaN(cvId)) {
        return res.status(400).json({ message: "Invalid CV ID" });
      }

      const { templateType, additionalInfo } = req.body;

      const updatedCV = await cvService.updateCV(
        cvId,
        userId as number,
        templateType,
        additionalInfo
      );

      res.status(200).json({
        message: "CV updated successfully",
        data: updatedCV,
      });
    } catch (error) {
      console.error("Update CV error:", error);
      res.status(500).json({
        message: "Failed to update CV",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  // Delete CV
  async deleteCV(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id;
      const cvId = parseInt(req.params.id as string);

      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      if (isNaN(cvId)) {
        return res.status(400).json({ message: "Invalid CV ID" });
      }

      await cvService.deleteCV(cvId, userId as number);

      res.status(200).json({
        message: "CV deleted successfully",
      });
    } catch (error) {
      console.error("Delete CV error:", error);
      res.status(500).json({
        message: "Failed to delete CV",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
}

export const cvMainController = new CVMainController();
