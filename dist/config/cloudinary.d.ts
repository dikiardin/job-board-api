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
export declare const cloudinaryUpload: (file: Express.Multer.File) => Promise<CloudinaryUploadResult>;
export declare const uploadBufferDirect: (buffer: Buffer, options: UploadRequestOptions) => Promise<CloudinaryUploadResult>;
export declare const uploadStreamDirect: (stream: NodeJS.ReadableStream, options: UploadRequestOptions) => Promise<CloudinaryUploadResult>;
export declare const deleteCloudinaryAsset: (publicId: string, resourceType?: CloudinaryResourceType) => Promise<any>;
export {};
//# sourceMappingURL=cloudinary.d.ts.map