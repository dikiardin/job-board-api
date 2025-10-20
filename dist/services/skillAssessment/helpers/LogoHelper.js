"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogoHelper = void 0;
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const pdfConstants_1 = require("../constants/pdfConstants");
class LogoHelper {
    static addLogo(doc, pageWidth) {
        try {
            const logoPath = path.join(__dirname, "../../../logo-pdf/nobg_logo.png");
            if (fs.existsSync(logoPath)) {
                doc.image(logoPath, pageWidth - pdfConstants_1.PDF_LAYOUT.LOGO_X_OFFSET, pdfConstants_1.PDF_LAYOUT.LOGO_Y, {
                    fit: [pdfConstants_1.PDF_LAYOUT.LOGO_WIDTH, pdfConstants_1.PDF_LAYOUT.LOGO_HEIGHT],
                    align: "center",
                    valign: "center",
                });
            }
        }
        catch (error) {
            // Logo not found, continuing without logo
        }
    }
}
exports.LogoHelper = LogoHelper;
