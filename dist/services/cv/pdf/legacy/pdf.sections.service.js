"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pdfSectionsService = exports.PDFSectionsService = void 0;
class PDFSectionsService {
    // Add EDUCATION Section
    addEducationSection(doc, cvData, yPosition, margin, contentWidth) {
        console.log('Checking EDUCATION section...');
        console.log('Education data:', cvData.additionalInfo?.educationDetails);
        console.log('Current yPosition before EDUCATION:', yPosition);
        if (cvData.education || cvData.additionalInfo?.educationDetails) {
            console.log('EDUCATION section will be added');
            // Check if we need a new page before starting education
            if (yPosition > 650) {
                console.log('Adding new page for EDUCATION');
                doc.addPage();
                yPosition = 50;
            }
            this.addSectionHeader(doc, 'EDUCATION', yPosition, margin, contentWidth);
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
    // Add LICENSES & CERTIFICATION Section
    addCertificationsSection(doc, cvData, yPosition, margin, contentWidth) {
        if (cvData.additionalInfo?.certifications && cvData.additionalInfo.certifications.length > 0) {
            // Check if we need a new page
            if (yPosition > 650) {
                doc.addPage();
                yPosition = 50;
            }
            this.addSectionHeader(doc, 'LICENSES & CERTIFICATION', yPosition, margin, contentWidth);
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
    // Add SKILLS Section
    addSkillsSection(doc, cvData, yPosition, margin, contentWidth) {
        // Check if we need a new page
        if (yPosition > 700) {
            doc.addPage();
            yPosition = 50;
        }
        // SKILLS Section
        if (cvData.skills && cvData.skills.length > 0 || cvData.additionalInfo?.skills || cvData.additionalInfo?.skillCategories) {
            this.addSectionHeader(doc, 'SKILLS', yPosition, margin, contentWidth);
            yPosition += 20;
            // Use skill categories if available
            if (cvData.additionalInfo?.skillCategories) {
                const categories = cvData.additionalInfo.skillCategories;
                Object.keys(categories).forEach((category, index) => {
                    const skills = categories[category];
                    if (skills && skills.length > 0) {
                        // Category name (Bold, 10pt)
                        doc.fontSize(10).font('Helvetica-Bold').text(`${category}: `, margin, yPosition, {
                            continued: true,
                            width: contentWidth
                        });
                        // Skills in category (Regular, 10pt)
                        const skillsText = skills.map((skill) => skill.split(' ').map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ')).join(', ');
                        doc.fontSize(10).font('Helvetica').text(skillsText, {
                            width: contentWidth - 100
                        });
                        yPosition += 15;
                    }
                });
            }
            else if (cvData.additionalInfo?.skills && cvData.additionalInfo.skills.length > 0) {
                // Use additional skills if no categories
                const skillsText = cvData.additionalInfo.skills.join(', ');
                doc.fontSize(10).font('Helvetica').text(skillsText, margin, yPosition, {
                    width: contentWidth,
                    lineGap: 2
                });
                yPosition += doc.heightOfString(skillsText, { width: contentWidth, lineGap: 2 }) + 10;
            }
            else if (cvData.skills && cvData.skills.length > 0) {
                // Fallback to basic skills
                const skillsText = cvData.skills.join(', ');
                doc.fontSize(10).font('Helvetica').text(skillsText, margin, yPosition, {
                    width: contentWidth,
                    lineGap: 2
                });
                yPosition += doc.heightOfString(skillsText, { width: contentWidth, lineGap: 2 }) + 10;
            }
        }
        return yPosition;
    }
    // Add section header helper
    addSectionHeader(doc, title, yPosition, margin, contentWidth) {
        doc.fontSize(12).font('Helvetica-Bold').text(title, margin, yPosition);
        // Add underline
        const titleWidth = doc.widthOfString(title);
        doc.moveTo(margin, yPosition + 15)
            .lineTo(margin + titleWidth, yPosition + 15)
            .stroke();
    }
}
exports.PDFSectionsService = PDFSectionsService;
exports.pdfSectionsService = new PDFSectionsService();
//# sourceMappingURL=pdf.sections.service.js.map