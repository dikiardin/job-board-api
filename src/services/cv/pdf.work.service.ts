export class PDFWorkService {
  // Generate work experience section
  generateWorkExperience(doc: any, cvData: any, yPosition: number, margin: number, contentWidth: number): number {
    if (
      cvData.additionalInfo?.workExperience &&
      cvData.additionalInfo.workExperience.length > 0
    ) {
      // Check if we need a new page before starting work experience
      if (yPosition > 650) {
        doc.addPage();
        yPosition = 50;
      }

      this.addSectionHeader(
        doc,
        "WORK EXPERIENCE",
        yPosition,
        margin,
        contentWidth
      );
      yPosition += 20;

      cvData.additionalInfo.workExperience.forEach(
        (workExp: any, index: number) => {
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
            workExp.responsibilities.forEach((responsibility: string) => {
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
          if (
            index <
            (cvData.additionalInfo?.workExperience?.length || 0) - 1
          ) {
            yPosition += 10;
          }
        }
      );
      yPosition += 15; // Space after entire section
    }
    return yPosition;
  }

  // Add section header helper
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

export const pdfWorkService = new PDFWorkService();
