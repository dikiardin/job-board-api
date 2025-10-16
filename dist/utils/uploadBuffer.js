"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cloudinaryUpload = void 0;
exports.uploadBufferToCloudinary = uploadBufferToCloudinary;
exports.uploadToCloudinary = uploadToCloudinary;
exports.deleteFromCloudinary = deleteFromCloudinary;
const cloudinary_1 = require("../config/cloudinary");
Object.defineProperty(exports, "cloudinaryUpload", { enumerable: true, get: function () { return cloudinary_1.cloudinaryUpload; } });
async function uploadBufferToCloudinary(buffer, options) {
    const uploadOptions = {
        filename: options.fileName ?? `${Date.now()}`,
        resourceType: options.resourceType ?? "raw",
        folder: options.folder,
        useFilename: true,
        uniqueFilename: false,
        accessMode: "public",
    };
    if (options.fileName) {
        uploadOptions.publicId = options.fileName;
    }
    const result = await (0, cloudinary_1.uploadBufferDirect)(buffer, uploadOptions);
    return {
        secureUrl: result.secure_url,
        publicId: result.public_id,
    };
}
async function uploadToCloudinary(stream, fileName) {
    const response = await (0, cloudinary_1.uploadStreamDirect)(stream, {
        filename: fileName,
        resourceType: "raw",
        publicId: fileName.replace(/\.[^/.]+$/, ""),
        useFilename: true,
        uniqueFilename: false,
        accessMode: "public",
    });
    return {
        secure_url: response.secure_url,
        public_id: response.public_id,
    };
}
async function deleteFromCloudinary(fileUrl) {
    const match = fileUrl.match(/\/upload\/(?:v\d+\/)?(.+)\.[a-zA-Z0-9]+$/);
    if (!match || !match[1])
        return null;
    const publicId = match[1];
    return (0, cloudinary_1.deleteCloudinaryAsset)(publicId, "raw");
}
