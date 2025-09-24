"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pdfService = void 0;
const PDFDocument = require('pdfkit');
class PDFService {
    async generateCVPDF(cvData, templateType = 'ats') {
        return new Promise((resolve, reject) => {
            try {
                const doc = new PDFDocument({ margin: 50 });
                const chunks = [];
                doc.on('data', (chunk) => chunks.push(chunk));
                doc.on('end', () => resolve(Buffer.concat(chunks)));
                // Generate PDF based on template type
                switch (templateType) {
                    case 'ats':
                        this.generateATSTemplate(doc, cvData);
                        break;
                    case 'modern':
                        this.generateModernTemplate(doc, cvData);
                        break;
                    case 'creative':
                        this.generateCreativeTemplate(doc, cvData);
                        break;
                    default:
                        this.generateATSTemplate(doc, cvData);
                }
                doc.end();
            }
            catch (error) {
                reject(error);
            }
        });
    }
    generateATSTemplate(doc, cvData) {
        let yPosition = 50;
        // Header - Personal Information
        doc.fontSize(24).font('Helvetica-Bold').text(cvData.personalInfo.name, 50, yPosition);
        yPosition += 35;
        doc.fontSize(12).font('Helvetica');
        if (cvData.personalInfo.email) {
            doc.text(`Email: ${cvData.personalInfo.email}`, 50, yPosition);
            yPosition += 20;
        }
        if (cvData.personalInfo.phone) {
            doc.text(`Phone: ${cvData.personalInfo.phone}`, 50, yPosition);
            yPosition += 20;
        }
        if (cvData.personalInfo.address) {
            doc.text(`Address: ${cvData.personalInfo.address}`, 50, yPosition);
            yPosition += 20;
        }
        yPosition += 20;
        // Objective (if provided)
        if (cvData.additionalInfo?.objective) {
            doc.fontSize(16).font('Helvetica-Bold').text('OBJECTIVE', 50, yPosition);
            yPosition += 25;
            doc.fontSize(12).font('Helvetica').text(cvData.additionalInfo.objective, 50, yPosition, {
                width: 500,
                align: 'justify'
            });
            yPosition += doc.heightOfString(cvData.additionalInfo.objective, { width: 500 }) + 20;
        }
        // Education
        if (cvData.education) {
            doc.fontSize(16).font('Helvetica-Bold').text('EDUCATION', 50, yPosition);
            yPosition += 25;
            doc.fontSize(12).font('Helvetica').text(cvData.education, 50, yPosition);
            yPosition += 30;
        }
        // Work Experience
        if (cvData.employments.length > 0) {
            doc.fontSize(16).font('Helvetica-Bold').text('WORK EXPERIENCE', 50, yPosition);
            yPosition += 25;
            cvData.employments.forEach((employment) => {
                doc.fontSize(14).font('Helvetica-Bold').text(employment.position, 50, yPosition);
                yPosition += 20;
                doc.fontSize(12).font('Helvetica-Bold').text(employment.company, 50, yPosition);
                yPosition += 15;
                const startDate = employment.startDate ? new Date(employment.startDate).toLocaleDateString() : 'Present';
                const endDate = employment.endDate ? new Date(employment.endDate).toLocaleDateString() : 'Present';
                doc.fontSize(11).font('Helvetica').text(`${startDate} - ${endDate}`, 50, yPosition);
                yPosition += 25;
            });
        }
        // Skills
        if (cvData.skills.length > 0) {
            doc.fontSize(16).font('Helvetica-Bold').text('SKILLS', 50, yPosition);
            yPosition += 25;
            doc.fontSize(12).font('Helvetica').text(cvData.skills.join(', '), 50, yPosition, {
                width: 500
            });
            yPosition += doc.heightOfString(cvData.skills.join(', '), { width: 500 }) + 20;
        }
        // Additional Skills (if provided)
        if (cvData.additionalInfo?.skills && cvData.additionalInfo.skills.length > 0) {
            doc.fontSize(16).font('Helvetica-Bold').text('ADDITIONAL SKILLS', 50, yPosition);
            yPosition += 25;
            doc.fontSize(12).font('Helvetica').text(cvData.additionalInfo.skills.join(', '), 50, yPosition, {
                width: 500
            });
            yPosition += doc.heightOfString(cvData.additionalInfo.skills.join(', '), { width: 500 }) + 20;
        }
        // Languages (if provided)
        if (cvData.additionalInfo?.languages && cvData.additionalInfo.languages.length > 0) {
            doc.fontSize(16).font('Helvetica-Bold').text('LANGUAGES', 50, yPosition);
            yPosition += 25;
            cvData.additionalInfo.languages.forEach((lang) => {
                doc.fontSize(12).font('Helvetica').text(`${lang.name}: ${lang.level}`, 50, yPosition);
                yPosition += 18;
            });
            yPosition += 10;
        }
        // Certifications (if provided)
        if (cvData.additionalInfo?.certifications && cvData.additionalInfo.certifications.length > 0) {
            doc.fontSize(16).font('Helvetica-Bold').text('CERTIFICATIONS', 50, yPosition);
            yPosition += 25;
            cvData.additionalInfo.certifications.forEach((cert) => {
                doc.fontSize(12).font('Helvetica-Bold').text(cert.name, 50, yPosition);
                yPosition += 15;
                doc.fontSize(11).font('Helvetica').text(`${cert.issuer} - ${cert.date}`, 50, yPosition);
                yPosition += 20;
            });
        }
        // Projects (if provided)
        if (cvData.additionalInfo?.projects && cvData.additionalInfo.projects.length > 0) {
            doc.fontSize(16).font('Helvetica-Bold').text('PROJECTS', 50, yPosition);
            yPosition += 25;
            cvData.additionalInfo.projects.forEach((project) => {
                doc.fontSize(12).font('Helvetica-Bold').text(project.name, 50, yPosition);
                yPosition += 15;
                doc.fontSize(11).font('Helvetica').text(project.description, 50, yPosition, { width: 500 });
                yPosition += doc.heightOfString(project.description, { width: 500 }) + 5;
                doc.text(`Technologies: ${project.technologies.join(', ')}`, 50, yPosition);
                yPosition += 15;
                if (project.url) {
                    doc.text(`URL: ${project.url}`, 50, yPosition);
                    yPosition += 15;
                }
                yPosition += 10;
            });
        }
        // Badges/Achievements
        if (cvData.badges.length > 0) {
            doc.fontSize(16).font('Helvetica-Bold').text('ACHIEVEMENTS', 50, yPosition);
            yPosition += 25;
            cvData.badges.forEach((badge) => {
                doc.fontSize(12).font('Helvetica').text(`${badge.name} - ${new Date(badge.awardedAt).toLocaleDateString()}`, 50, yPosition);
                yPosition += 18;
            });
        }
    }
    generateModernTemplate(doc, cvData) {
        // Similar to ATS but with some styling differences
        // For now, use the same structure as ATS
        this.generateATSTemplate(doc, cvData);
    }
    generateCreativeTemplate(doc, cvData) {
        // More creative design with colors and different layout
        // For now, use the same structure as ATS
        this.generateATSTemplate(doc, cvData);
    }
}
exports.pdfService = new PDFService();
//# sourceMappingURL=pdf.service.js.map