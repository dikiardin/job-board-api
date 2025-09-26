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

// File filter for payment proof (images and PDFs)
const paymentProofFileFilter = (
  req: any,
  file: Express.Multer.File | undefined,
  cb: multer.FileFilterCallback
) => {
  if (!file) {
    return cb(null, false);
  }

  const allowedTypes = /jpeg|jpg|png|gif|webp|pdf/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = /image\/(jpeg|jpg|png|gif|webp)|application\/pdf/.test(file.mimetype);

  if (mimetype && extname) {
    cb(null, true);
  } else {
    cb(new Error("Only image files (JPEG, JPG, PNG, GIF, WEBP) and PDF files are allowed"));
  }
};

// Configure multer for images
const upload = multer({
  storage: storage,
  fileFilter: imageFileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit (match with frontend)
  },
});

// Configure multer for payment proof (images + PDFs)
const uploadPaymentProof = multer({
  storage: storage,
  fileFilter: paymentProofFileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit (match with frontend)
  },
});

// Generic upload middleware functions that can be used in any route
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
// Upload for payment proof (supports images and PDFs)
export const uploadPaymentProofSingle = (fieldName: string) => {
  return (req: any, res: any, next: any) => {
    uploadPaymentProof.single(fieldName)(req, res, (err: any) => {
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
