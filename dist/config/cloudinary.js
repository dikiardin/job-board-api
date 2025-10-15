"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCloudinaryAsset = exports.uploadStreamDirect = exports.uploadBufferDirect = exports.cloudinaryUpload = void 0;
const axios_1 = __importDefault(require("axios"));
const form_data_1 = __importDefault(require("form-data"));
const crypto_1 = __importDefault(require("crypto"));
const path_1 = __importDefault(require("path"));
const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
const API_KEY = process.env.CLOUDINARY_API_KEY;
const API_SECRET = process.env.CLOUDINARY_API_SECRET;
const ensureCredentials = () => {
    if (!CLOUD_NAME || !API_KEY || !API_SECRET) {
        throw new Error("Cloudinary credentials are not fully configured");
    }
};
const normalizeValue = (value) => {
    if (typeof value === "boolean")
        return value ? "true" : "false";
    return value.toString();
};
const createSignature = (params) => {
    ensureCredentials();
    const filteredEntries = Object.entries(params).filter(([, value]) => value !== undefined && value !== null && value !== "");
    const toSign = filteredEntries
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([key, value]) => `${key}=${normalizeValue(value)}`)
        .join("&");
    return crypto_1.default
        .createHash("sha1")
        .update(`${toSign}${API_SECRET}`)
        .digest("hex");
};
const appendFormFields = (form, params) => {
    Object.entries(params).forEach(([key, value]) => {
        if (value === undefined || value === null || value === "")
            return;
        form.append(key, normalizeValue(value));
    });
};
const uploadBufferWithOptions = async (buffer, options) => {
    ensureCredentials();
    const resourceType = options.resourceType ?? "image";
    const timestamp = Math.floor(Date.now() / 1000);
    const signedParams = {
        access_mode: options.accessMode,
        folder: options.folder,
        overwrite: options.overwrite,
        public_id: options.publicId,
        timestamp,
        type: options.type,
        unique_filename: options.uniqueFilename,
        use_filename: options.useFilename,
    };
    const signature = createSignature(signedParams);
    const form = new form_data_1.default();
    appendFormFields(form, signedParams);
    form.append("api_key", API_KEY);
    form.append("timestamp", timestamp.toString());
    form.append("signature", signature);
    form.append("file", buffer, {
        filename: options.filename,
    });
    const uploadUrl = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${resourceType}/upload`;
    const { data } = await axios_1.default.post(uploadUrl, form, {
        headers: form.getHeaders(),
    });
    return data;
};
const streamToBuffer = (stream) => new Promise((resolve, reject) => {
    const chunks = [];
    stream.on("data", (chunk) => chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)));
    stream.on("end", () => resolve(Buffer.concat(chunks)));
    stream.on("error", reject);
});
const cloudinaryUpload = async (file) => {
    const ext = path_1.default.extname(file.originalname).toLowerCase();
    const docTypes = [".pdf", ".doc", ".docx"];
    const isDoc = docTypes.includes(ext);
    const resourceType = isDoc ? "raw" : "image";
    const baseName = path_1.default.parse(file.originalname).name;
    const publicId = `${baseName}${ext}`;
    return uploadBufferWithOptions(file.buffer, {
        filename: file.originalname,
        resourceType,
        publicId,
        useFilename: true,
        uniqueFilename: false,
        type: "upload",
        accessMode: "public",
    });
};
exports.cloudinaryUpload = cloudinaryUpload;
const uploadBufferDirect = async (buffer, options) => uploadBufferWithOptions(buffer, {
    ...options,
    useFilename: options.useFilename ?? true,
    uniqueFilename: options.uniqueFilename ?? false,
    accessMode: options.accessMode ?? "public",
    type: options.type ?? "upload",
});
exports.uploadBufferDirect = uploadBufferDirect;
const uploadStreamDirect = async (stream, options) => {
    const buffer = await streamToBuffer(stream);
    return (0, exports.uploadBufferDirect)(buffer, options);
};
exports.uploadStreamDirect = uploadStreamDirect;
const deleteCloudinaryAsset = async (publicId, resourceType = "raw") => {
    ensureCredentials();
    const timestamp = Math.floor(Date.now() / 1000);
    const params = {
        public_id: publicId,
        timestamp,
    };
    const signature = createSignature(params);
    const body = new URLSearchParams({
        public_id: publicId,
        timestamp: timestamp.toString(),
        api_key: API_KEY,
        signature,
    });
    const destroyUrl = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${resourceType}/destroy`;
    const { data } = await axios_1.default.post(destroyUrl, body.toString(), {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
    });
    return data;
};
exports.deleteCloudinaryAsset = deleteCloudinaryAsset;
//# sourceMappingURL=cloudinary.js.map