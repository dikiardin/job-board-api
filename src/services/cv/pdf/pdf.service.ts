import { CVData } from '../core/cv.service';
import { pdfCoreService } from './pdf.core.service';

export class PDFService {
  async generatePDF(cvData: CVData, templateType: string = 'ats'): Promise<string> {
    return pdfCoreService.generatePDF(cvData, templateType);
  }
}

export const pdfService = new PDFService();
