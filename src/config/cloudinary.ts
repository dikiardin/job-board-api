"use strict";

import axios from "axios";
import FormData from "form-data";
import crypto from "crypto";
import path from "path";

const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
const API_KEY = process.env.CLOUDINARY_API_KEY;
const API_SECRET = process.env.CLOUDINARY_API_SECRET;

type CloudinaryResourceType = "image" | "video" | "raw" | "auto";

export interface CloudinaryUploadResult {
  secure_url: string;
  public_id: string;
  resource_type: CloudinaryResourceType;
  [key: string]: unknown;
}

interface UploadRequestOptions {
  filename: string;
  resourceType?: CloudinaryResourceType;
  publicId?: string;
  folder?: string;
  useFilename?: boolean;
  uniqueFilename?: boolean;
  type?: string;
  accessMode?: string;
  overwrite?: boolean;
}

const ensureCredentials = () => {
  if (!CLOUD_NAME || !API_KEY || !API_SECRET) {
    throw new Error("Cloudinary credentials are not fully configured");
  }
};

const normalizeValue = (value: string | number | boolean): string => {
  if (typeof value === "boolean") return value ? "true" : "false";
  return value.toString();
};

const createSignature = (
  params: Record<string, string | number | boolean | undefined>
) => {
  ensureCredentials();
  const filteredEntries = Object.entries(params).filter(
    ([, value]) => value !== undefined && value !== null && value !== ""
  );

  const toSign = filteredEntries
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${normalizeValue(value as any)}`)
    .join("&");

  return crypto
    .createHash("sha1")
    .update(`${toSign}${API_SECRET}`)
    .digest("hex");
};

const appendFormFields = (
  form: FormData,
  params: Record<string, string | number | boolean | undefined>
) => {
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    form.append(key, normalizeValue(value));
  });
};

const uploadBufferWithOptions = async (
  buffer: Buffer,
  options: UploadRequestOptions
): Promise<CloudinaryUploadResult> => {
  ensureCredentials();

  const resourceType: CloudinaryResourceType =
    options.resourceType ?? "image";
  const timestamp = Math.floor(Date.now() / 1000);

  const signedParams: Record<string, string | number | boolean | undefined> = {
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

  const form = new FormData();
  appendFormFields(form, signedParams);
  form.append("api_key", API_KEY!);
  form.append("timestamp", timestamp.toString());
  form.append("signature", signature);
  form.append("file", buffer, {
    filename: options.filename,
  });

  const uploadUrl = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${resourceType}/upload`;

  const { data } = await axios.post<CloudinaryUploadResult>(uploadUrl, form, {
    headers: form.getHeaders(),
  });

  return data;
};

const streamToBuffer = (
  stream: NodeJS.ReadableStream
): Promise<Buffer> =>
  new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    stream.on("data", (chunk) =>
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk))
    );
    stream.on("end", () => resolve(Buffer.concat(chunks)));
    stream.on("error", reject);
  });

export const cloudinaryUpload = async (
  file: Express.Multer.File
): Promise<CloudinaryUploadResult> => {
  const ext = path.extname(file.originalname).toLowerCase();
  const docTypes = [".pdf", ".doc", ".docx"];
  const isDoc = docTypes.includes(ext);

  const resourceType: CloudinaryResourceType = isDoc ? "raw" : "image";

  const baseName = path.parse(file.originalname).name;
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

export const uploadBufferDirect = async (
  buffer: Buffer,
  options: UploadRequestOptions
): Promise<CloudinaryUploadResult> =>
  uploadBufferWithOptions(buffer, {
    ...options,
    useFilename: options.useFilename ?? true,
    uniqueFilename: options.uniqueFilename ?? false,
    accessMode: options.accessMode ?? "public",
    type: options.type ?? "upload",
  });

export const uploadStreamDirect = async (
  stream: NodeJS.ReadableStream,
  options: UploadRequestOptions
): Promise<CloudinaryUploadResult> => {
  const buffer = await streamToBuffer(stream);
  return uploadBufferDirect(buffer, options);
};

export const deleteCloudinaryAsset = async (
  publicId: string,
  resourceType: CloudinaryResourceType = "raw"
) => {
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
    api_key: API_KEY!,
    signature,
  });

  const destroyUrl = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${resourceType}/destroy`;

  const { data } = await axios.post(destroyUrl, body.toString(), {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  return data;
};
