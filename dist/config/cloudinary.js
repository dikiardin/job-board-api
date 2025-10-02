"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cloudinaryUpload = void 0;
const cloudinary_1 = require("cloudinary");
const path_1 = __importDefault(require("path"));
const streamifier = __importStar(require("streamifier"));
cloudinary_1.v2.config({
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
});
const cloudinaryUpload = (file) => {
    return new Promise((resolve, reject) => {
        const ext = path_1.default.extname(file.originalname).toLowerCase();
        const docTypes = [".pdf", ".doc", ".docx"];
        const isDoc = docTypes.includes(ext);
        const resourceType = isDoc ? "raw" : "image";
        const baseName = path_1.default.parse(file.originalname).name;
        const publicId = `${baseName}${ext}`;
        const uploadStream = cloudinary_1.v2.uploader.upload_stream({
            resource_type: resourceType,
            use_filename: true,
            unique_filename: false,
            public_id: publicId,
            type: "upload",
            access_mode: "public", // ← Added: Ensure files are publicly accessible
            // Don't force format - let Cloudinary handle it automatically
        }, (err, result) => {
            if (err) {
                reject(err);
            }
            else if (result) {
                resolve(result);
            }
            else {
                reject(new Error("Upload failed: no result returned"));
            }
        });
        streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
};
exports.cloudinaryUpload = cloudinaryUpload;
// COMMENTED OUT - Previous version with complex logic
/*
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
        access_mode: "public", // ← Added: Ensure files are publicly accessible
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
};*/
//# sourceMappingURL=cloudinary.js.map