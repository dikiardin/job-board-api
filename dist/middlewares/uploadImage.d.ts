export declare const uploadSingle: (fieldName: string) => (req: any, res: any, next: any) => void;
export declare const uploadPaymentProofSingle: (fieldName: string) => (req: any, res: any, next: any) => void;
export declare const uploadMultiple: (fieldName: string, maxCount?: number) => import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
export declare const uploadFields: (fields: {
    name: string;
    maxCount?: number;
}[]) => import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
//# sourceMappingURL=uploadImage.d.ts.map