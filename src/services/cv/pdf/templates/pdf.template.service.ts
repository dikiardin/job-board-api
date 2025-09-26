const PDFDocument = require("pdfkit");
import { pdfHeaderService } from "../legacy/pdf.header.service";
import { pdfWorkService } from "../legacy/pdf.work.service";
import { pdfSectionsService } from "../legacy/pdf.sections.service";

export class PDFTemplateService {
  // Generate ATS-friendly CV template
  generateATSTemplate(doc: any, cvData: any) {
    const templateConfig = this.initializeTemplateConfig();
    this.logDebugInfo(cvData);
    
    let yPosition = this.generateHeaderSection(doc, cvData, templateConfig);
    yPosition = this.generateContentSections(doc, cvData, yPosition, templateConfig);
    this.logCompletion(yPosition);
  }

  private initializeTemplateConfig() {
    return {
      margin: 50,
      pageWidth: 595.28, // A4 width in points
      contentWidth: 495.28 // pageWidth - margin * 2
    };
  }

  private logDebugInfo(cvData: any): void {
    console.log("=== CV DATA DEBUG ===");
    console.log("Personal Info:", cvData.personalInfo);
    console.log("Additional Info:", cvData.additionalInfo);
    console.log("Work Experience:", cvData.additionalInfo?.workExperience);
    console.log("Education Details:", cvData.additionalInfo?.educationDetails);
    console.log("Skill Categories:", cvData.additionalInfo?.skillCategories);
    console.log("====================");
  }

  private generateHeaderSection(doc: any, cvData: any, config: any): number {
    return pdfHeaderService.generateHeader(doc, cvData, config.pageWidth, config.margin);
  }

  private generateContentSections(doc: any, cvData: any, yPosition: number, config: any): number {
    yPosition = pdfHeaderService.generateSummary(doc, cvData, yPosition, config.margin, config.contentWidth);
    yPosition = pdfHeaderService.generateProjects(doc, cvData, yPosition, config.margin, config.contentWidth);
    yPosition = pdfWorkService.generateWorkExperience(doc, cvData, yPosition, config.margin, config.contentWidth);
    yPosition = pdfSectionsService.addEducationSection(doc, cvData, yPosition, config.margin, config.contentWidth);
    yPosition = pdfSectionsService.addCertificationsSection(doc, cvData, yPosition, config.margin, config.contentWidth);
    yPosition = pdfSectionsService.addSkillsSection(doc, cvData, yPosition, config.margin, config.contentWidth);
    return yPosition;
  }

  private logCompletion(yPosition: number): void {
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
