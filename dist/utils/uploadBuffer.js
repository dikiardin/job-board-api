"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadBufferToCloudinary = uploadBufferToCloudinary;
exports.uploadToCloudinary = uploadToCloudinary;
exports.deleteFromCloudinary = deleteFromCloudinary;
const cloudinary_1 = require("cloudinary");
async function uploadBufferToCloudinary(buffer, options) {
    const result = await new Promise((resolve, reject) => {
        const uploadOptions = {
            folder: options.folder,
            resource_type: options.resourceType ?? "raw",
        };
        if (options.fileName) {
            uploadOptions.public_id = options.fileName;
        }
        const uploadStream = cloudinary_1.v2.uploader.upload_stream(uploadOptions, (error, uploadResult) => {
            if (error || !uploadResult) {
                return reject(error);
            }
            resolve(uploadResult);
        });
        uploadStream.end(buffer);
    });
    return {
        secureUrl: result.secure_url,
        publicId: result.public_id,
    };
}
async function uploadToCloudinary(stream, fileName) {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary_1.v2.uploader.upload_stream({
            resource_type: "raw",
            public_id: fileName.replace(/\.[^/.]+$/, ""), // Remove extension from public_id
            use_filename: true,
            unique_filename: false, // Don't add random suffix
            access_mode: "public", // Ensure public access
        }, (error, result) => {
            if (error || !result) {
                return reject(error || new Error('Upload failed'));
            }
            resolve({
                secure_url: result.secure_url,
                public_id: result.public_id
            });
        });
        stream.pipe(uploadStream);
    });
}
async function deleteFromCloudinary(fileUrl) {
    const match = fileUrl.match(/\/upload\/(?:v\d+\/)?(.+)\.[a-zA-Z0-9]+$/);
    if (!match || !match[1])
        return null;
    const publicId = match[1];
    return cloudinary_1.v2.uploader.destroy(publicId, {
        resource_type: "raw",
    });
}
//# sourceMappingURL=uploadBuffer.js.map