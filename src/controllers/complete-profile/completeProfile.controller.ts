// import { NextFunction, Request, Response } from "express";
// import { CompleteProfileService } from "../../services/complete-profile/completeProfile.service";
// import { v2 as cloudinary } from "cloudinary";
// import * as streamifier from "streamifier";

// export class CompleteProfileController {
//   public static async completeProfile(
//     req: Request,
//     res: Response,
//     next: NextFunction
//   ): Promise<void> {
//     try {
//       // Get user info from token
//       const decrypt = res.locals.decrypt;
//       if (!decrypt) {
//         res.status(401).json({ message: "Unauthorized" });
//         return; // exit the function, TS is happy
//       }

//       const { userId, role } = decrypt;

//       // Validate file
//       const fileBuffer = req.file?.buffer;
//       if (!fileBuffer) {
//         res.status(400).json({ message: "File is required" });
//         return;
//       }

//       // Upload file to Cloudinary safely
//       const uploadResult: any = await new Promise((resolve, reject) => {
//         const stream = cloudinary.uploader.upload_stream(
//           { folder: "profile" }, // optional folder
//           (error, result) => {
//             if (error) return reject(error);
//             resolve(result);
//           }
//         );
//         streamifier.createReadStream(fileBuffer).pipe(stream);
//       });

//       // Call your service with the uploaded file URL
//       const updatedProfile = await CompleteProfileService.completeProfile(
//         userId,
//         role,
//         req.body,
//         uploadResult.secure_url
//       );

//       // Send success response
//       res.status(200).json({
//         message: "Profile completed successfully",
//         data: updatedProfile,
//       });

//     } catch (error) {
//       next(error); // pass errors to Express error handler
//     }
//   }
// }

import { NextFunction, Request, Response } from "express";
import { CompleteProfileService } from "../../services/complete-profile/completeProfile.service";
import { cloudinaryUpload } from "../../config/cloudinary";

export class CompleteProfileController {
  public static async completeProfile(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const decrypt = res.locals.decrypt;
      if (!decrypt) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const userId = decrypt.userId;
      const role = decrypt.role;
      const files = req.files as Record<string, Express.Multer.File[]>;

      const uploadedFile =
        (files.profilePicture && files.profilePicture[0]) ||
        (files.logo && files.logo[0]);
      if (!uploadedFile) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      // Pass the Multer file directly to the service
      const updatedProfile = await CompleteProfileService.completeProfile(
        userId,
        role,
        req.body,
        uploadedFile
      );

      res.status(200).json({
        message: "Profile completed successfully",
        data: updatedProfile,
      });
    } catch (error) {
      next(error);
    }
  }
}
