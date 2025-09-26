import { CVData } from '../core/cv.service';
import { uploadToCloudinary } from '../../../utils/uploadBuffer';
import { v4 as uuidv4 } from 'uuid';
const PDFDocument = require('pdfkit');
import { Readable } from 'stream';

export class PDFCoreService {
  async generatePDF(cvData: CVData, templateType: string = 'ats'): Promise<string> {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument();
        const buffers: Buffer[] = [];

        this.setupPDFDocument(doc, buffers);
        this.generatePDFContent(doc, cvData, templateType);
        this.handlePDFCompletion(doc, buffers, resolve, reject);
      } catch (error) {
        reject(error);
      }
    });
  }

  private setupPDFDocument(doc: any, buffers: Buffer[]): void {
    doc.on('data', (chunk: Buffer) => buffers.push(chunk));
  }

  private generatePDFContent(doc: any, cvData: CVData, templateType: string): void {
    const { pdfATSTemplateService } = require('./templates/pdf.ats.template.service');
    pdfATSTemplateService.generateATSTemplate(doc, cvData);
    doc.end();
  }

  private async handlePDFCompletion(
    doc: any, 
    buffers: Buffer[], 
    resolve: (value: string) => void, 
    reject: (reason?: any) => void
  ): Promise<void> {
    doc.on('end', async () => {
      try {
        const pdfBuffer = Buffer.concat(buffers);
        this.validatePDFBuffer(pdfBuffer);
        const fileName = this.generateFileName();
        const result = await this.uploadPDFToCloudinary(pdfBuffer, fileName);
        resolve(result.secure_url);
      } catch (error) {
        console.error('PDF upload error:', error);
        reject(error);
      }
    });
  }

  private validatePDFBuffer(pdfBuffer: Buffer): void {
    if (pdfBuffer.length === 0) {
      throw new Error('PDF buffer is empty');
    }
    
    if (!pdfBuffer.toString('ascii', 0, 4).startsWith('%PDF')) {
      throw new Error('Invalid PDF buffer - missing PDF header');
    }
  }

  private generateFileName(): string {
    return `cv-files/cv_${uuidv4()}.pdf`;
  }

  private async uploadPDFToCloudinary(pdfBuffer: Buffer, fileName: string): Promise<any> {
    return await uploadToCloudinary(Readable.from(pdfBuffer), fileName);
  }

  addSectionHeader(doc: any, title: string, yPosition: number, margin: number, contentWidth: number) {
    doc.fontSize(14).font('Helvetica-Bold').text(title, margin, yPosition);
    
    // Add underline
    const titleWidth = doc.widthOfString(title);
    doc.strokeColor('#000000').lineWidth(0.5);
    doc.moveTo(margin, yPosition + 18).lineTo(margin + titleWidth, yPosition + 18).stroke();
  }

  // Helper method to check if new page is needed
  checkNewPage(doc: any, yPosition: number, threshold: number = 650): number {
    if (yPosition > threshold) {
      doc.addPage();
      return 50; // Reset to top of new page
    }
    return yPosition;
  }

  // Helper method to add contact information
  generateContactInfo(doc: any, cvData: CVData, pageWidth: number, yPosition: number): number {
    const contactInfo = [];
    if (cvData.personalInfo.address) contactInfo.push(cvData.personalInfo.address);
    if (cvData.personalInfo.phone) contactInfo.push(cvData.personalInfo.phone);
    if (cvData.personalInfo.email) contactInfo.push(cvData.personalInfo.email);
    
    // Add LinkedIn if available
    if (cvData.additionalInfo?.linkedin) {
      contactInfo.push(cvData.additionalInfo.linkedin);
    }
    
    // Add Portfolio if available
    if (cvData.additionalInfo?.portfolio) {
      contactInfo.push(cvData.additionalInfo.portfolio);
    }
    
    if (contactInfo.length > 0) {
      const contactLine = contactInfo.join(' | ');
      doc.fontSize(10).font('Helvetica');
      const contactWidth = doc.widthOfString(contactLine);
      doc.text(contactLine, (pageWidth - contactWidth) / 2, yPosition);
      return yPosition + 30;
    }
    
    return yPosition + 20;
  }

  // Helper method to generate header section
  generateHeader(doc: any, cvData: CVData, pageWidth: number): number {
    let yPosition = 50;

    // Header - Name (Centered, Bold, 16pt)
    doc.fontSize(16).font('Helvetica-Bold');
    const nameWidth = doc.widthOfString(cvData.personalInfo.name);
    doc.text(cvData.personalInfo.name, (pageWidth - nameWidth) / 2, yPosition);
    yPosition += 20;

    // Job Title/Position (Centered, 12pt)
    const jobTitle = cvData.additionalInfo?.objective ? 
      cvData.additionalInfo.objective.split('.')[0] : 'Fullstack Web Developer';
    doc.fontSize(12).font('Helvetica');
    const titleWidth = doc.widthOfString(jobTitle);
    doc.text(jobTitle, (pageWidth - titleWidth) / 2, yPosition);
    yPosition += 15;

    // Contact Information
    yPosition = this.generateContactInfo(doc, cvData, pageWidth, yPosition);

    return yPosition;
  }
}

export const pdfCoreService = new PDFCoreService();
