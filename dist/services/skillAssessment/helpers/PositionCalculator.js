"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PositionCalculator = void 0;
const pdfConstants_1 = require("../constants/pdfConstants");
class PositionCalculator {
    static getScoreY(hasBadge) {
        return hasBadge
            ? pdfConstants_1.PDF_LAYOUT.BASE_SCORE_Y + pdfConstants_1.PDF_LAYOUT.BADGE_OFFSET
            : pdfConstants_1.PDF_LAYOUT.BASE_SCORE_Y;
    }
    static getDateY(hasBadge) {
        return hasBadge
            ? pdfConstants_1.PDF_LAYOUT.BASE_DATE_Y + pdfConstants_1.PDF_LAYOUT.BADGE_OFFSET
            : pdfConstants_1.PDF_LAYOUT.BASE_DATE_Y;
    }
    static getCodeY(hasBadge) {
        return hasBadge
            ? pdfConstants_1.PDF_LAYOUT.BASE_CODE_Y + pdfConstants_1.PDF_LAYOUT.BADGE_OFFSET
            : pdfConstants_1.PDF_LAYOUT.BASE_CODE_Y;
    }
    static getQRY(hasBadge) {
        return hasBadge
            ? pdfConstants_1.PDF_LAYOUT.BASE_QR_Y + pdfConstants_1.PDF_LAYOUT.BADGE_OFFSET
            : pdfConstants_1.PDF_LAYOUT.BASE_QR_Y;
    }
}
exports.PositionCalculator = PositionCalculator;
