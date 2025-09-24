interface UploadOptions {
    folder: string;
    resourceType?: "image" | "video" | "raw" | "auto";
    fileName?: string;
}
export declare function uploadBufferToCloudinary(buffer: Buffer, options: UploadOptions): Promise<{
    secureUrl: string;
    publicId: string;
}>;
export declare function uploadToCloudinary(stream: NodeJS.ReadableStream, fileName: string): Promise<{
    secure_url: string;
    public_id: string;
}>;
export declare function deleteFromCloudinary(fileUrl: string): Promise<any>;
export {};
//# sourceMappingURL=uploadBuffer.d.ts.map