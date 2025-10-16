"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pdfHeaderService = exports.PDFHeaderService = void 0;
class PDFHeaderService {
    // Generate header section (name, title, contact info)
    generateHeader(doc, cvData, pageWidth, margin) {
        let yPosition = 50;
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
        return yPosition;
    }
    // Generate summary section
    generateSummary(doc, cvData, yPosition, margin, contentWidth) {
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
        return yPosition;
    }
    // Generate projects section
    generateProjects(doc, cvData, yPosition, margin, contentWidth) {
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
        return yPosition;
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
}
exports.PDFHeaderService = PDFHeaderService;
exports.pdfHeaderService = new PDFHeaderService();
