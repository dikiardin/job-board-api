"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pdfATSTemplateService = exports.PDFATSTemplateService = void 0;
const cvTemplate_1 = require("../../utils/cvTemplate");
const pdf_core_service_1 = require("./pdf.core.service");
const pdf_sections_helper_service_1 = require("./pdf.sections.helper.service");
class PDFATSTemplateService {
    generateATSTemplate(doc, cvData) {
        const pageWidth = 595.28; // A4 width in points
        const margin = 50;
        const contentWidth = pageWidth - (margin * 2);
        // Debug: Log what data we have
        console.log('=== CV DATA DEBUG ===');
        console.log('Personal Info:', cvData.personalInfo);
        console.log('Additional Info:', cvData.additionalInfo);
        console.log('Work Experience:', cvData.additionalInfo?.workExperience);
        console.log('Education Details:', cvData.additionalInfo?.educationDetails);
        console.log('Skill Categories:', cvData.additionalInfo?.skillCategories);
        console.log('====================');
        // Generate header section
        let yPosition = pdf_core_service_1.pdfCoreService.generateHeader(doc, cvData, pageWidth);
        // Generate all sections
        yPosition = this.generateSummarySection(doc, cvData, yPosition, margin, contentWidth);
        yPosition = this.generateProjectsSection(doc, cvData, yPosition, margin, contentWidth);
        yPosition = pdf_sections_helper_service_1.pdfSectionsHelperService.generateWorkExperienceSection(doc, cvData, yPosition, margin, contentWidth);
        yPosition = pdf_sections_helper_service_1.pdfSectionsHelperService.generateEducationSection(doc, cvData, yPosition, margin, contentWidth);
        yPosition = pdf_sections_helper_service_1.pdfSectionsHelperService.generateCertificationsSection(doc, cvData, yPosition, margin, contentWidth);
        yPosition = this.generateSkillsSection(doc, cvData, yPosition, margin, contentWidth);
    }
    generateSummarySection(doc, cvData, yPosition, margin, contentWidth) {
        if (cvData.additionalInfo?.objective) {
            pdf_core_service_1.pdfCoreService.addSectionHeader(doc, 'SUMMARY', yPosition, margin, contentWidth);
            yPosition += 20;
            doc.fontSize(10).font('Helvetica').text(cvData.additionalInfo.objective, margin, yPosition, {
                width: contentWidth,
                align: 'left',
                lineGap: 2
            });
            yPosition += doc.heightOfString(cvData.additionalInfo.objective, { width: contentWidth, lineGap: 2 }) + 15;
        }
        return yPosition;
    }
    generateProjectsSection(doc, cvData, yPosition, margin, contentWidth) {
        if (cvData.additionalInfo?.projects && cvData.additionalInfo.projects.length > 0) {
            pdf_core_service_1.pdfCoreService.addSectionHeader(doc, 'PROJECT EXPERIENCE', yPosition, margin, contentWidth);
            yPosition += 20;
            cvData.additionalInfo.projects.forEach((project, index) => {
                // Check if we need a new page
                yPosition = pdf_core_service_1.pdfCoreService.checkNewPage(doc, yPosition, 650);
                // Project Name (Bold, 11pt)
                doc.fontSize(11).font('Helvetica-Bold').text(project.name, margin, yPosition);
                yPosition += 12;
                // Project Description - split into bullet points
                const descriptions = project.description.split(/[.!?]\s+/).filter(desc => desc.trim());
                descriptions.forEach((desc) => {
                    if (desc.trim()) {
                        const bulletText = `• ${desc.trim()}${desc.endsWith('.') || desc.endsWith('!') || desc.endsWith('?') ? '' : '.'}`;
                        doc.fontSize(10).font('Helvetica').text(bulletText, margin, yPosition, {
                            width: contentWidth,
                            lineGap: 1
                        });
                        yPosition += doc.heightOfString(bulletText, { width: contentWidth, lineGap: 1 }) + 2;
                    }
                });
                // Project Link (if available)
                if (project.url) {
                    doc.fontSize(10).font('Helvetica').text(`Project Link: ${project.url}`, margin, yPosition);
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
    generateSkillsSection(doc, cvData, yPosition, margin, contentWidth) {
        const allSkills = [...(cvData.skills || [])];
        if (cvData.additionalInfo?.skills?.length) {
            allSkills.push(...cvData.additionalInfo.skills);
        }
        if (allSkills.length > 0) {
            pdf_core_service_1.pdfCoreService.addSectionHeader(doc, 'SKILLS', yPosition, margin, contentWidth);
            yPosition += 20;
            // Use universal skill categorization system
            const customCategories = cvData.additionalInfo?.skillCategories;
            const { categorized, uncategorized } = (0, cvTemplate_1.smartSkillCategorization)(allSkills, customCategories);
            yPosition = this.renderCategorizedSkills(doc, categorized, uncategorized, customCategories, margin, contentWidth, yPosition);
        }
        return yPosition;
    }
    renderCategorizedSkills(doc, categorized, uncategorized, customCategories, margin, contentWidth, yPosition) {
        if (customCategories && Object.keys(categorized).length > 0) {
            // User has defined custom categories - display categorized skills
            const sortedCategories = Object.keys(categorized).sort();
            for (const category of sortedCategories) {
                const skills = categorized[category];
                if (skills && skills.length > 0) {
                    doc.fontSize(10).font('Helvetica-Bold').text(`${category}: `, margin, yPosition, { continued: true });
                    doc.fontSize(10).font('Helvetica').text(skills.join(', '));
                    yPosition += 12;
                }
            }
            // Display uncategorized skills if any
            if (uncategorized.length > 0) {
                doc.fontSize(10).font('Helvetica-Bold').text('Other Skills: ', margin, yPosition, { continued: true });
                doc.fontSize(10).font('Helvetica').text(uncategorized.join(', '));
                yPosition += 12;
            }
        }
        else {
            // No custom categories - display all skills in clean comma-separated format
            yPosition = this.renderSimpleSkills(doc, uncategorized, margin, contentWidth, yPosition);
        }
        return yPosition;
    }
    renderSimpleSkills(doc, skills, margin, contentWidth, yPosition) {
        const skillsPerLine = 10; // More skills per line for compact layout
        const skillChunks = [];
        for (let i = 0; i < skills.length; i += skillsPerLine) {
            skillChunks.push(skills.slice(i, i + skillsPerLine));
        }
        skillChunks.forEach((chunk) => {
            const skillLine = chunk.join(', ');
            doc.fontSize(10).font('Helvetica').text(skillLine, margin, yPosition, {
                width: contentWidth,
                align: 'left'
            });
            yPosition += 12;
        });
        return yPosition;
    }
}
exports.PDFATSTemplateService = PDFATSTemplateService;
exports.pdfATSTemplateService = new PDFATSTemplateService();
//# sourceMappingURL=pdf.ats.template.service.js.map