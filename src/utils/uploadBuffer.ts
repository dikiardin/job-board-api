import {
  cloudinaryUpload,
  deleteCloudinaryAsset,
  uploadBufferDirect,
  uploadStreamDirect,
} from "../config/cloudinary";

interface UploadOptions {
  folder: string;
  resourceType?: "image" | "video" | "raw" | "auto";
  fileName?: string;
}

export async function uploadBufferToCloudinary(
  buffer: Buffer,
  options: UploadOptions
): Promise<{ secureUrl: string; publicId: string }> {
  const uploadOptions: Parameters<typeof uploadBufferDirect>[1] = {
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

  const result = await uploadBufferDirect(buffer, uploadOptions);

  return {
    secureUrl: result.secure_url,
    publicId: result.public_id,
  };
}

export async function uploadToCloudinary(
  stream: NodeJS.ReadableStream,
  fileName: string
): Promise<{ secure_url: string; public_id: string }> {
  const response = await uploadStreamDirect(stream, {
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

export async function deleteFromCloudinary(fileUrl: string) {
  const match = fileUrl.match(/\/upload\/(?:v\d+\/)?(.+)\.[a-zA-Z0-9]+$/);

  if (!match || !match[1]) return null;

  const publicId = match[1];

  return deleteCloudinaryAsset(publicId, "raw");
}

export { cloudinaryUpload };
