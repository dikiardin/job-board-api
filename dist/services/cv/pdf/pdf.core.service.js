"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pdfCoreService = exports.PDFCoreService = void 0;
const uploadBuffer_1 = require("../../../utils/uploadBuffer");
const uuid_1 = require("uuid");
const PDFDocument = require('pdfkit');
const stream_1 = require("stream");
class PDFCoreService {
    async generatePDF(cvData, templateType = 'ats') {
        return new Promise((resolve, reject) => {
            try {
                const doc = new PDFDocument();
                const buffers = [];
                this.setupPDFDocument(doc, buffers);
                this.generatePDFContent(doc, cvData, templateType);
                this.handlePDFCompletion(doc, buffers, resolve, reject);
            }
            catch (error) {
                reject(error);
            }
        });
    }
    setupPDFDocument(doc, buffers) {
        doc.on('data', (chunk) => buffers.push(chunk));
    }
    generatePDFContent(doc, cvData, templateType) {
        const { pdfATSTemplateService } = require('./templates/pdf.ats.template.service');
        pdfATSTemplateService.generateATSTemplate(doc, cvData);
        doc.end();
    }
    async handlePDFCompletion(doc, buffers, resolve, reject) {
        doc.on('end', async () => {
            try {
                const pdfBuffer = Buffer.concat(buffers);
                this.validatePDFBuffer(pdfBuffer);
                const fileName = this.generateFileName();
                const result = await this.uploadPDFToCloudinary(pdfBuffer, fileName);
                resolve(result.secure_url);
            }
            catch (error) {
                console.error('PDF upload error:', error);
                reject(error);
            }
        });
    }
    validatePDFBuffer(pdfBuffer) {
        if (pdfBuffer.length === 0) {
            throw new Error('PDF buffer is empty');
        }
        if (!pdfBuffer.toString('ascii', 0, 4).startsWith('%PDF')) {
            throw new Error('Invalid PDF buffer - missing PDF header');
        }
    }
    generateFileName() {
        return `cv-files/cv_${(0, uuid_1.v4)()}.pdf`;
    }
    async uploadPDFToCloudinary(pdfBuffer, fileName) {
        return await (0, uploadBuffer_1.uploadToCloudinary)(stream_1.Readable.from(pdfBuffer), fileName);
    }
    addSectionHeader(doc, title, yPosition, margin, contentWidth) {
        doc.fontSize(14).font('Helvetica-Bold').text(title, margin, yPosition);
        // Add underline
        const titleWidth = doc.widthOfString(title);
        doc.strokeColor('#000000').lineWidth(0.5);
        doc.moveTo(margin, yPosition + 18).lineTo(margin + titleWidth, yPosition + 18).stroke();
    }
    // Helper method to check if new page is needed
    checkNewPage(doc, yPosition, threshold = 650) {
        if (yPosition > threshold) {
            doc.addPage();
            return 50; // Reset to top of new page
        }
        return yPosition;
    }
    // Helper method to add contact information
    generateContactInfo(doc, cvData, pageWidth, yPosition) {
        const contactInfo = [];
        if (cvData.personalInfo.address)
            contactInfo.push(cvData.personalInfo.address);
        if (cvData.personalInfo.phone)
            contactInfo.push(cvData.personalInfo.phone);
        if (cvData.personalInfo.email)
            contactInfo.push(cvData.personalInfo.email);
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
    generateHeader(doc, cvData, pageWidth) {
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
exports.PDFCoreService = PDFCoreService;
exports.pdfCoreService = new PDFCoreService();
