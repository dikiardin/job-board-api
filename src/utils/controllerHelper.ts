import { Response } from "express";
import { CustomError } from "./customError";

export class ControllerHelper {
  public static parseId(id: string | undefined): number {
    if (!id) {
      throw new CustomError("ID is required", 400);
    }
    
    const parsedId = parseInt(id);
    if (isNaN(parsedId)) {
      throw new CustomError("Invalid ID format", 400);
    }
    
    return parsedId;
  }

  public static getUserId(res: Response): number {
    const userId = parseInt(res.locals.decrypt.userId);
    if (isNaN(userId)) {
      throw new CustomError("Invalid user ID", 400);
    }
    return userId;
  }

  public static validateRequired(data: Record<string, any>, message: string): void {
    const missingFields = Object.entries(data)
      .filter(([_, value]) => !value)
      .map(([key, _]) => key);

    if (missingFields.length > 0) {
      throw new CustomError(message, 400);
    }
  }

  public static buildUpdateData(body: any, allowedFields: string[]): Record<string, any> {
    const updateData: Record<string, any> = {};
    
    allowedFields.forEach(field => {
      if (body[field] !== undefined) {
        if (field.includes('Date') && body[field]) {
          updateData[field] = new Date(body[field]);
        } else {
          updateData[field] = body[field];
        }
      }
    });

    return updateData;
  }
}
