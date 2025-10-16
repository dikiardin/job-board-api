"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadPaymentProofSingle = exports.uploadPaymentProof = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
// Configure memory storage for Cloudinary
const storage = multer_1.default.memoryStorage();
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
// Configure multer for payment proof (images + PDFs)
exports.uploadPaymentProof = (0, multer_1.default)({
    storage: storage,
    fileFilter: paymentProofFileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    },
});
// Upload for payment proof (supports images and PDFs)
const uploadPaymentProofSingle = (fieldName) => {
    return (req, res, next) => {
        exports.uploadPaymentProof.single(fieldName)(req, res, (err) => {
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
