import * as path from "path";
import * as fs from "fs";
import { PDF_LAYOUT } from "../constants/pdfConstants";

export class LogoHelper {
  static addLogo(doc: any, pageWidth: number): void {
    try {
      const logoPath = path.join(__dirname, "../../../logo-pdf/nobg_logo.png");
      if (fs.existsSync(logoPath)) {
        doc.image(
          logoPath,
          pageWidth - PDF_LAYOUT.LOGO_X_OFFSET,
          PDF_LAYOUT.LOGO_Y,
          {
            fit: [PDF_LAYOUT.LOGO_WIDTH, PDF_LAYOUT.LOGO_HEIGHT],
            align: "center",
            valign: "center",
          }
        );
      }
    } catch (error) {
      // Logo not found, continuing without logo
    }
  }
}
