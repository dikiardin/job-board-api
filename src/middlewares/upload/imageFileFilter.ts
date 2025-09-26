import multer from "multer";
import path from "path";

// Configure memory storage for Cloudinary
const storage = multer.memoryStorage();

// File filter for images only
const imageFileFilter = (
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

// Configure multer for images
export const upload = multer({
  storage: storage,
  fileFilter: imageFileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

// Generic upload middleware functions
export const uploadSingle = (fieldName: string) => {
  return (req: any, res: any, next: any) => {
    upload.single(fieldName)(req, res, (err: any) => {
      if (err) {
        return res.status(400).json({ 
          message: "File upload error", 
          error: err.message 
        });
      }
      
      next();
    });
  };
};

export const uploadMultiple = (fieldName: string, maxCount: number = 5) =>
  upload.array(fieldName, maxCount);
export const uploadFields = (fields: { name: string; maxCount?: number }[]) =>
  upload.fields(fields);
