"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pdfSectionsHelperService = exports.PDFSectionsHelperService = void 0;
const pdf_core_service_1 = require("./pdf.core.service");
class PDFSectionsHelperService {
    generateWorkExperienceSection(doc, cvData, yPosition, margin, contentWidth) {
        console.log('Checking WORK EXPERIENCE section...');
        console.log('Work Experience data:', cvData.additionalInfo?.workExperience);
        console.log('Current yPosition before WORK EXPERIENCE:', yPosition);
        if (cvData.additionalInfo?.workExperience && cvData.additionalInfo.workExperience.length > 0) {
            console.log('WORK EXPERIENCE section will be added');
            // Check if we need a new page before starting work experience
            yPosition = pdf_core_service_1.pdfCoreService.checkNewPage(doc, yPosition, 650);
            pdf_core_service_1.pdfCoreService.addSectionHeader(doc, 'WORK EXPERIENCE', yPosition, margin, contentWidth);
            yPosition += 20;
            cvData.additionalInfo.workExperience.forEach((workExp, index) => {
                console.log(`Adding work experience ${index + 1}:`, workExp.company);
                // Check if we need a new page
                yPosition = pdf_core_service_1.pdfCoreService.checkNewPage(doc, yPosition, 700);
                // Company Name (Bold, 11pt)
                doc.fontSize(11).font('Helvetica-Bold').text(workExp.company, margin, yPosition);
                yPosition += 12;
                // Add responsibilities
                if (workExp.responsibilities && workExp.responsibilities.length > 0) {
                    workExp.responsibilities.forEach((responsibility) => {
                        doc.fontSize(10).font('Helvetica').text(`• ${responsibility}`, margin, yPosition, {
                            width: contentWidth,
                            lineGap: 1
                        });
                        yPosition += doc.heightOfString(`• ${responsibility}`, { width: contentWidth, lineGap: 1 }) + 2;
                    });
                }
                // Add spacing between entries (except last one)
                if (index < (cvData.additionalInfo?.workExperience?.length || 0) - 1) {
                    yPosition += 10;
                }
            });
            yPosition += 15; // Space after entire section
            console.log('WORK EXPERIENCE section completed, yPosition:', yPosition);
        }
        else {
            console.log('WORK EXPERIENCE section SKIPPED - no data found');
        }
        return yPosition;
    }
    generateEducationSection(doc, cvData, yPosition, margin, contentWidth) {
        console.log('Checking EDUCATION section...');
        console.log('Education data:', cvData.additionalInfo?.educationDetails);
        console.log('Current yPosition before EDUCATION:', yPosition);
        if (cvData.education || cvData.additionalInfo?.educationDetails) {
            console.log('EDUCATION section will be added');
            // Check if we need a new page before starting education
            yPosition = pdf_core_service_1.pdfCoreService.checkNewPage(doc, yPosition, 650);
            pdf_core_service_1.pdfCoreService.addSectionHeader(doc, 'EDUCATION', yPosition, margin, contentWidth);
            yPosition += 20;
            // Detailed Education from additionalInfo
            if (cvData.additionalInfo?.educationDetails) {
                cvData.additionalInfo.educationDetails.forEach((edu, index) => {
                    console.log(`Adding education ${index + 1}:`, edu.institution);
                    // Institution Name (Bold, 11pt)
                    doc.fontSize(11).font('Helvetica-Bold').text(`${edu.institution} (${edu.year})`, margin, yPosition);
                    yPosition += 12;
                    // Degree and GPA (10pt)
                    const degreeText = edu.gpa ? `${edu.degree} | GPA ${edu.gpa}` : edu.degree;
                    doc.fontSize(10).font('Helvetica').text(degreeText, margin, yPosition);
                    yPosition += 12;
                    // Add spacing between entries (except last one)
                    if (index < (cvData.additionalInfo?.educationDetails?.length || 0) - 1) {
                        yPosition += 8;
                    }
                });
            }
            else if (cvData.education) {
                // Fallback to basic education
                console.log('Using fallback education:', cvData.education);
                doc.fontSize(11).font('Helvetica-Bold').text(cvData.education, margin, yPosition);
                yPosition += 12;
            }
            yPosition += 15; // Space after entire section
            console.log('EDUCATION section completed, yPosition:', yPosition);
        }
        else {
            console.log('EDUCATION section SKIPPED - no data found');
        }
        return yPosition;
    }
    generateCertificationsSection(doc, cvData, yPosition, margin, contentWidth) {
        if (cvData.additionalInfo?.certifications && cvData.additionalInfo.certifications.length > 0) {
            pdf_core_service_1.pdfCoreService.addSectionHeader(doc, 'LICENSES & CERTIFICATION', yPosition, margin, contentWidth);
            yPosition += 20;
            cvData.additionalInfo.certifications.forEach((cert, index) => {
                // Issuer and Date (Bold, 11pt)
                doc.fontSize(11).font('Helvetica-Bold').text(`${cert.issuer} (${cert.date})`, margin, yPosition);
                yPosition += 12;
                // Certification Name (10pt)
                doc.fontSize(10).font('Helvetica').text(cert.name, margin, yPosition);
                yPosition += 10;
                // Link if available (10pt)
                if (cert.link) {
                    doc.fontSize(10).font('Helvetica').text(`Link: ${cert.link}`, margin, yPosition);
                }
                else {
                    doc.fontSize(10).font('Helvetica').text('Link: Certificate Link', margin, yPosition);
                }
                yPosition += 12;
                // Add spacing between entries (except last one)
                if (index < (cvData.additionalInfo?.certifications?.length || 0) - 1) {
                    yPosition += 8;
                }
            });
            yPosition += 15; // Space after entire section
        }
        return yPosition;
    }
}
exports.PDFSectionsHelperService = PDFSectionsHelperService;
exports.pdfSectionsHelperService = new PDFSectionsHelperService();
//# sourceMappingURL=pdf.sections.helper.service.js.map