import {
  v2 as cloudinary,
  UploadApiErrorResponse,
  UploadApiResponse,
} from "cloudinary";
import path from "path";
import * as streamifier from "streamifier";

cloudinary.config({
  api_key: process.env.CLOUDINARY_API_KEY as string,
  api_secret: process.env.CLOUDINARY_API_SECRET as string,
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME as string,
});

// export const cloudinaryUpload = (
//   file: Express.Multer.File
// ): Promise<UploadApiResponse> => {
//   return new Promise((resolve, reject) => {
//     const ext = path.extname(file.originalname).toLowerCase();
//     const docTypes = [".pdf", ".doc", ".docx"];
//     const isDoc = docTypes.includes(ext);

//     const resourceType: "image" | "raw" = isDoc ? "raw" : "image";

//     const baseName = path.parse(file.originalname).name;
//     const publicId = `${baseName}${ext}`;

//     const uploadStream = cloudinary.uploader.upload_stream(
//       {
//         resource_type: resourceType,
//         use_filename: true, 
//         unique_filename: false, 
//         public_id: publicId, 
//         format: "pdf", 
//         type: "upload",
//       },
//       (err?: UploadApiErrorResponse, result?: UploadApiResponse): void => {
//         if (err) {
//           reject(err);
//         } else if (result) {
//           resolve(result);
//         } else {
//           reject(new Error("Upload failed: no result returned"));
//         }
//       }
//     );

//     streamifier.createReadStream(file.buffer).pipe(uploadStream);
//   });
// };


export const cloudinaryUpload = (
  file: Express.Multer.File | undefined
): Promise<UploadApiResponse> => {
  return new Promise((resolve, reject) => {
    if (!file || !file.originalname || !file.buffer) {
      return reject(new Error("No file provided or invalid file"));
    }

    const ext = path.extname(file.originalname).toLowerCase();
    const docTypes = [".pdf", ".doc", ".docx"];
    const isDoc = docTypes.includes(ext);

    const resourceType: "image" | "raw" = isDoc ? "raw" : "image";

    const baseName = path.parse(file.originalname).name;
    const publicId = `${baseName}${ext}`;

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: resourceType,
        use_filename: true,
        unique_filename: false,
        public_id: publicId,
        type: "upload",
        ...(isDoc ? {} : { format: "jpg" }), // only add format if image
      },
      (err?: UploadApiErrorResponse, result?: UploadApiResponse) => {
        if (err) {
          reject(err);
        } else if (result) {
          resolve(result);
        } else {
          reject(new Error("Upload failed: no result returned"));
        }
      }
    );

    streamifier.createReadStream(file.buffer).pipe(uploadStream);
  });
};