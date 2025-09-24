"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pdfTemplateService = exports.PDFTemplateService = void 0;
const PDFDocument = require("pdfkit");
class PDFTemplateService {
    // Generate ATS-friendly CV template
    generateATSTemplate(doc, cvData) {
        const margin = 50;
        const pageWidth = 595.28; // A4 width in points
        const contentWidth = pageWidth - margin * 2;
        let yPosition = 50;
        // Debug: Log what data we have
        console.log("=== CV DATA DEBUG ===");
        console.log("Personal Info:", cvData.personalInfo);
        console.log("Additional Info:", cvData.additionalInfo);
        console.log("Work Experience:", cvData.additionalInfo?.workExperience);
        console.log("Education Details:", cvData.additionalInfo?.educationDetails);
        console.log("Skill Categories:", cvData.additionalInfo?.skillCategories);
        console.log("====================");
        // Header - Name (Centered, Bold, 16pt)
        doc.fontSize(16).font("Helvetica-Bold");
        const nameWidth = doc.widthOfString(cvData.personalInfo.name);
        doc.text(cvData.personalInfo.name, (pageWidth - nameWidth) / 2, yPosition);
        yPosition += 20;
        // Job Title/Objective Title (Centered, 12pt)
        if (cvData.additionalInfo?.objective) {
            const firstLine = cvData.additionalInfo.objective.split(".")[0] || "Professional";
            doc.fontSize(12).font("Helvetica");
            const titleWidth = doc.widthOfString(firstLine);
            doc.text(firstLine, (pageWidth - titleWidth) / 2, yPosition);
            yPosition += 15;
        }
        // Contact Information (Centered, 10pt)
        const contactInfo = [];
        if (cvData.personalInfo.address)
            contactInfo.push(cvData.personalInfo.address);
        if (cvData.personalInfo.phone)
            contactInfo.push(cvData.personalInfo.phone);
        if (cvData.personalInfo.email)
            contactInfo.push(cvData.personalInfo.email);
        if (cvData.additionalInfo?.linkedin)
            contactInfo.push(cvData.additionalInfo.linkedin);
        if (cvData.additionalInfo?.portfolio)
            contactInfo.push(cvData.additionalInfo.portfolio);
        if (contactInfo.length > 0) {
            const contactText = contactInfo.join(" | ");
            doc.fontSize(10).font("Helvetica");
            const contactWidth = doc.widthOfString(contactText);
            doc.text(contactText, (pageWidth - contactWidth) / 2, yPosition);
            yPosition += 25;
        }
        // SUMMARY Section
        if (cvData.additionalInfo?.objective) {
            this.addSectionHeader(doc, "SUMMARY", yPosition, margin, contentWidth);
            yPosition += 20;
            doc
                .fontSize(10)
                .font("Helvetica")
                .text(cvData.additionalInfo.objective, margin, yPosition, {
                width: contentWidth,
                align: "justify",
                lineGap: 2,
            });
            yPosition +=
                doc.heightOfString(cvData.additionalInfo.objective, {
                    width: contentWidth,
                    lineGap: 2,
                }) + 15;
        }
        // PROJECT EXPERIENCE Section
        if (cvData.additionalInfo?.projects &&
            cvData.additionalInfo.projects.length > 0) {
            this.addSectionHeader(doc, "PROJECT EXPERIENCE", yPosition, margin, contentWidth);
            yPosition += 20;
            cvData.additionalInfo.projects.forEach((project, index) => {
                // Check if we need a new page
                if (yPosition > 700) {
                    doc.addPage();
                    yPosition = 50;
                }
                // Project Name (Bold, 11pt)
                doc
                    .fontSize(11)
                    .font("Helvetica-Bold")
                    .text(project.name, margin, yPosition);
                yPosition += 12;
                // Project Description (10pt)
                if (project.description) {
                    const bulletPoints = project.description
                        .split(". ")
                        .filter((point) => point.trim());
                    bulletPoints.forEach((point) => {
                        const cleanPoint = point.trim().replace(/\.$/, "");
                        if (cleanPoint) {
                            doc
                                .fontSize(10)
                                .font("Helvetica")
                                .text(`• ${cleanPoint}.`, margin, yPosition, {
                                width: contentWidth,
                                lineGap: 1,
                            });
                            yPosition +=
                                doc.heightOfString(`• ${cleanPoint}.`, {
                                    width: contentWidth,
                                    lineGap: 1,
                                }) + 2;
                        }
                    });
                }
                // Project URL (if available)
                if (project.url) {
                    doc
                        .fontSize(10)
                        .font("Helvetica")
                        .text(`Project Link: ${project.url}`, margin, yPosition);
                    yPosition += 12;
                }
                // Add spacing between projects (except last one)
                if (index < (cvData.additionalInfo?.projects?.length || 0) - 1) {
                    yPosition += 8;
                }
            });
            yPosition += 15; // Space after entire section
        }
        // WORK EXPERIENCE Section
        if (cvData.additionalInfo?.workExperience &&
            cvData.additionalInfo.workExperience.length > 0) {
            // Check if we need a new page before starting work experience
            if (yPosition > 650) {
                doc.addPage();
                yPosition = 50;
            }
            this.addSectionHeader(doc, "WORK EXPERIENCE", yPosition, margin, contentWidth);
            yPosition += 20;
            cvData.additionalInfo.workExperience.forEach((workExp, index) => {
                // Check if we need a new page
                if (yPosition > 700) {
                    doc.addPage();
                    yPosition = 50;
                }
                // Company Name (Bold, 11pt)
                doc
                    .fontSize(11)
                    .font("Helvetica-Bold")
                    .text(workExp.company, margin, yPosition);
                yPosition += 12;
                // Add responsibilities
                if (workExp.responsibilities && workExp.responsibilities.length > 0) {
                    workExp.responsibilities.forEach((responsibility) => {
                        doc
                            .fontSize(10)
                            .font("Helvetica")
                            .text(`• ${responsibility}`, margin, yPosition, {
                            width: contentWidth,
                            lineGap: 1,
                        });
                        yPosition +=
                            doc.heightOfString(`• ${responsibility}`, {
                                width: contentWidth,
                                lineGap: 1,
                            }) + 2;
                    });
                }
                // Add spacing between entries (except last one)
                if (index <
                    (cvData.additionalInfo?.workExperience?.length || 0) - 1) {
                    yPosition += 10;
                }
            });
            yPosition += 15; // Space after entire section
        }
        // Continue with other sections
        yPosition = this.addEducationSection(doc, cvData, yPosition, margin, contentWidth);
        yPosition = this.addCertificationsSection(doc, cvData, yPosition, margin, contentWidth);
        yPosition = this.addSkillsSection(doc, cvData, yPosition, margin, contentWidth);
    }
    // Add section header helper
    addSectionHeader(doc, title, yPosition, margin, contentWidth) {
        doc.fontSize(12).font("Helvetica-Bold").text(title, margin, yPosition);
        // Add underline
        const titleWidth = doc.widthOfString(title);
        doc
            .moveTo(margin, yPosition + 15)
            .lineTo(margin + titleWidth, yPosition + 15)
            .stroke();
    }
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
}
exports.PDFTemplateService = PDFTemplateService;
exports.pdfTemplateService = new PDFTemplateService();
//# sourceMappingURL=pdf.template.old.service.js.map