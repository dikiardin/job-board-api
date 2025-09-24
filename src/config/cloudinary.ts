import {
  v2 as cloudinary,
  UploadApiErrorResponse,
  UploadApiResponse,
} from "cloudinary";
import path from "path";
import * as streamifier from "streamifier";

cloudinary.config({
  api_key: "331288569242839",
  api_secret: "0LLOBjRjjmBPWYbaECxd_dP5O34",
  cloud_name: "dluqjnhcm",
});

export const cloudinaryUpload = (
  file: Express.Multer.File
): Promise<UploadApiResponse> => {
  return new Promise((resolve, reject) => {
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
        format: "pdf", 
        type: "upload",
      },
      (err?: UploadApiErrorResponse, result?: UploadApiResponse): void => {
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
