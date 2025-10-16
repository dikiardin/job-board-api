"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadPaymentProofSingle = exports.uploadFields = exports.uploadMultiple = exports.uploadSingle = void 0;
// Re-export upload functions from modular structure
var uploadConfig_1 = require("./upload/uploadConfig");
Object.defineProperty(exports, "uploadSingle", { enumerable: true, get: function () { return uploadConfig_1.uploadSingle; } });
Object.defineProperty(exports, "uploadMultiple", { enumerable: true, get: function () { return uploadConfig_1.uploadMultiple; } });
Object.defineProperty(exports, "uploadFields", { enumerable: true, get: function () { return uploadConfig_1.uploadFields; } });
Object.defineProperty(exports, "uploadPaymentProofSingle", { enumerable: true, get: function () { return uploadConfig_1.uploadPaymentProofSingle; } });
