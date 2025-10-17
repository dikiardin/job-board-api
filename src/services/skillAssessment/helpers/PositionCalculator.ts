import { PDF_LAYOUT } from "../constants/pdfConstants";

export class PositionCalculator {
  static getScoreY(hasBadge: boolean): number {
    return hasBadge
      ? PDF_LAYOUT.BASE_SCORE_Y + PDF_LAYOUT.BADGE_OFFSET
      : PDF_LAYOUT.BASE_SCORE_Y;
  }

  static getDateY(hasBadge: boolean): number {
    return hasBadge
      ? PDF_LAYOUT.BASE_DATE_Y + PDF_LAYOUT.BADGE_OFFSET
      : PDF_LAYOUT.BASE_DATE_Y;
  }

  static getCodeY(hasBadge: boolean): number {
    return hasBadge
      ? PDF_LAYOUT.BASE_CODE_Y + PDF_LAYOUT.BADGE_OFFSET
      : PDF_LAYOUT.BASE_CODE_Y;
  }

  static getQRY(hasBadge: boolean): number {
    return hasBadge
      ? PDF_LAYOUT.BASE_QR_Y + PDF_LAYOUT.BADGE_OFFSET
      : PDF_LAYOUT.BASE_QR_Y;
  }
}
