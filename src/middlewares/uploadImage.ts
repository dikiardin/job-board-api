import multer from "multer";
import path from "path";

// Configure memory storage for Cloudinary
const storage = multer.memoryStorage();

// File filter for images only
const fileFilter = (
  req: any,
  file: Express.Multer.File | undefined,
  cb: multer.FileFilterCallback
) => {
  if (!file) {
    return cb(null, false);
  }

  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    cb(null, true);
  } else {
    cb(new Error("Only image files (JPEG, JPG, PNG, GIF, WEBP) are allowed"));
  }
};

// Configure multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 1 * 1024 * 1024, // 1MB limit
  },
});

// Generic upload middleware functions that can be used in any route
export const uploadSingle = (fieldName: string) => upload.single(fieldName);
export const uploadMultiple = (fieldName: string, maxCount: number = 5) =>
  upload.array(fieldName, maxCount);
export const uploadFields = (fields: { name: string; maxCount?: number }[]) =>
  upload.fields(fields);
