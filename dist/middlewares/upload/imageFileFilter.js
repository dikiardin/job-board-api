"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadFields = exports.uploadMultiple = exports.uploadSingle = exports.upload = void 0;
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
// Configure multer for images
exports.upload = (0, multer_1.default)({
    storage: storage,
    fileFilter: imageFileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    },
});
// Generic upload middleware functions
const uploadSingle = (fieldName) => {
    return (req, res, next) => {
        exports.upload.single(fieldName)(req, res, (err) => {
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
const uploadMultiple = (fieldName, maxCount = 5) => exports.upload.array(fieldName, maxCount);
exports.uploadMultiple = uploadMultiple;
const uploadFields = (fields) => exports.upload.fields(fields);
exports.uploadFields = uploadFields;
//# sourceMappingURL=imageFileFilter.js.map