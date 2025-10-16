"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pdfTemplateService = exports.PDFTemplateService = void 0;
const PDFDocument = require("pdfkit");
const pdf_header_service_1 = require("../legacy/pdf.header.service");
const pdf_work_service_1 = require("../legacy/pdf.work.service");
const pdf_sections_service_1 = require("../legacy/pdf.sections.service");
class PDFTemplateService {
    // Generate ATS-friendly CV template
    generateATSTemplate(doc, cvData) {
        const templateConfig = this.initializeTemplateConfig();
        this.logDebugInfo(cvData);
        let yPosition = this.generateHeaderSection(doc, cvData, templateConfig);
        yPosition = this.generateContentSections(doc, cvData, yPosition, templateConfig);
        this.logCompletion(yPosition);
    }
    initializeTemplateConfig() {
        return {
            margin: 50,
            pageWidth: 595.28, // A4 width in points
            contentWidth: 495.28 // pageWidth - margin * 2
        };
    }
    logDebugInfo(cvData) {
        console.log("=== CV DATA DEBUG ===");
        console.log("Personal Info:", cvData.personalInfo);
        console.log("Additional Info:", cvData.additionalInfo);
        console.log("Work Experience:", cvData.additionalInfo?.workExperience);
        console.log("Education Details:", cvData.additionalInfo?.educationDetails);
        console.log("Skill Categories:", cvData.additionalInfo?.skillCategories);
        console.log("====================");
    }
    generateHeaderSection(doc, cvData, config) {
        return pdf_header_service_1.pdfHeaderService.generateHeader(doc, cvData, config.pageWidth, config.margin);
    }
    generateContentSections(doc, cvData, yPosition, config) {
        yPosition = pdf_header_service_1.pdfHeaderService.generateSummary(doc, cvData, yPosition, config.margin, config.contentWidth);
        yPosition = pdf_header_service_1.pdfHeaderService.generateProjects(doc, cvData, yPosition, config.margin, config.contentWidth);
        yPosition = pdf_work_service_1.pdfWorkService.generateWorkExperience(doc, cvData, yPosition, config.margin, config.contentWidth);
        yPosition = pdf_sections_service_1.pdfSectionsService.addEducationSection(doc, cvData, yPosition, config.margin, config.contentWidth);
        yPosition = pdf_sections_service_1.pdfSectionsService.addCertificationsSection(doc, cvData, yPosition, config.margin, config.contentWidth);
        yPosition = pdf_sections_service_1.pdfSectionsService.addSkillsSection(doc, cvData, yPosition, config.margin, config.contentWidth);
        return yPosition;
    }
    logCompletion(yPosition) {
        console.log("=== CV GENERATION COMPLETED ===");
        console.log("Final yPosition:", yPosition);
        console.log("===============================");
    }
    // Add section header helper (shared utility)
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
exports.PDFTemplateService = PDFTemplateService;
exports.pdfTemplateService = new PDFTemplateService();
