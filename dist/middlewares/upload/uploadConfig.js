"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadConfig = exports.uploadPaymentProofSingle = exports.uploadFields = exports.uploadMultiple = exports.uploadSingle = void 0;
const imageFileFilter_1 = require("./imageFileFilter");
Object.defineProperty(exports, "uploadSingle", { enumerable: true, get: function () { return imageFileFilter_1.uploadSingle; } });
Object.defineProperty(exports, "uploadMultiple", { enumerable: true, get: function () { return imageFileFilter_1.uploadMultiple; } });
Object.defineProperty(exports, "uploadFields", { enumerable: true, get: function () { return imageFileFilter_1.uploadFields; } });
const paymentProofFileFilter_1 = require("./paymentProofFileFilter");
Object.defineProperty(exports, "uploadPaymentProofSingle", { enumerable: true, get: function () { return paymentProofFileFilter_1.uploadPaymentProofSingle; } });
// Default upload configuration
exports.uploadConfig = {
    maxFileSize: 5 * 1024 * 1024, // 5MB
    allowedImageTypes: ['jpeg', 'jpg', 'png', 'gif', 'webp'],
    allowedDocumentTypes: ['pdf'],
    allowedPaymentProofTypes: ['jpeg', 'jpg', 'png', 'gif', 'webp', 'pdf']
};
//# sourceMappingURL=uploadConfig.js.map