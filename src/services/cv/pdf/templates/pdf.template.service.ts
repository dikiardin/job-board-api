const PDFDocument = require("pdfkit");
import { pdfHeaderService } from "../legacy/pdf.header.service";
import { pdfWorkService } from "../legacy/pdf.work.service";
import { pdfSectionsService } from "../legacy/pdf.sections.service";

export class PDFTemplateService {
  // Generate ATS-friendly CV template
  generateATSTemplate(doc: any, cvData: any) {
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

    // Generate header section (name, title, contact)
    yPosition = pdfHeaderService.generateHeader(doc, cvData, pageWidth, margin);

    // Generate summary section
    yPosition = pdfHeaderService.generateSummary(doc, cvData, yPosition, margin, contentWidth);

    // Generate projects section
    yPosition = pdfHeaderService.generateProjects(doc, cvData, yPosition, margin, contentWidth);

    // Generate work experience section
    yPosition = pdfWorkService.generateWorkExperience(doc, cvData, yPosition, margin, contentWidth);

    // Generate remaining sections (education, certifications, skills)
    yPosition = pdfSectionsService.addEducationSection(doc, cvData, yPosition, margin, contentWidth);
    yPosition = pdfSectionsService.addCertificationsSection(doc, cvData, yPosition, margin, contentWidth);
    yPosition = pdfSectionsService.addSkillsSection(doc, cvData, yPosition, margin, contentWidth);

    console.log("=== CV GENERATION COMPLETED ===");
    console.log("Final yPosition:", yPosition);
    console.log("===============================");
  }


  // Add section header helper (shared utility)
  addSectionHeader(
    doc: any,
    title: string,
    yPosition: number,
    margin: number,
    contentWidth: number
  ) {
    doc.fontSize(12).font("Helvetica-Bold").text(title, margin, yPosition);

    // Add underline
    const titleWidth = doc.widthOfString(title);
    doc
      .moveTo(margin, yPosition + 15)
      .lineTo(margin + titleWidth, yPosition + 15)
      .stroke();
  }
}

export const pdfTemplateService = new PDFTemplateService();
