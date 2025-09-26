"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadFields = exports.uploadMultiple = exports.uploadPaymentProofSingle = exports.uploadSingle = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
// Configure memory storage for Cloudinary
const storage = multer_1.default.memoryStorage();
// File filter for images only
const imageFileFilter = (req, file, cb) => {
    if (!file) {
        return cb(null, false);
    }
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path_1.default.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (mimetype && extname) {
        cb(null, true);
    }
    else {
        cb(new Error("Only image files (JPEG, JPG, PNG, GIF, WEBP) are allowed"));
    }
};
// File filter for payment proof (images and PDFs)
const paymentProofFileFilter = (req, file, cb) => {
    if (!file) {
        return cb(null, false);
    }
    const allowedTypes = /jpeg|jpg|png|gif|webp|pdf/;
    const extname = allowedTypes.test(path_1.default.extname(file.originalname).toLowerCase());
    const mimetype = /image\/(jpeg|jpg|png|gif|webp)|application\/pdf/.test(file.mimetype);
    if (mimetype && extname) {
        cb(null, true);
    }
    else {
        cb(new Error("Only image files (JPEG, JPG, PNG, GIF, WEBP) and PDF files are allowed"));
    }
};
// Configure multer for images
const upload = (0, multer_1.default)({
    storage: storage,
    fileFilter: imageFileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit (match with frontend)
    },
});
// Configure multer for payment proof (images + PDFs)
const uploadPaymentProof = (0, multer_1.default)({
    storage: storage,
    fileFilter: paymentProofFileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit (match with frontend)
    },
});
// Generic upload middleware functions that can be used in any route
const uploadSingle = (fieldName) => {
    return (req, res, next) => {
        upload.single(fieldName)(req, res, (err) => {
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
exports.uploadSingle = uploadSingle;
// Upload for payment proof (supports images and PDFs)
const uploadPaymentProofSingle = (fieldName) => {
    return (req, res, next) => {
        uploadPaymentProof.single(fieldName)(req, res, (err) => {
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
exports.uploadPaymentProofSingle = uploadPaymentProofSingle;
const uploadMultiple = (fieldName, maxCount = 5) => upload.array(fieldName, maxCount);
exports.uploadMultiple = uploadMultiple;
const uploadFields = (fields) => upload.fields(fields);
exports.uploadFields = uploadFields;
//# sourceMappingURL=uploadImage.js.map