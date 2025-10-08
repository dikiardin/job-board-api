export class PDFLayoutHelper {
  public static addBorders(doc: any, pageWidth: number, pageHeight: number) {
    const primaryColor = "#467EC7";
    const goldColor = "#FFD700";

    doc.rect(20, 20, pageWidth - 40, pageHeight - 40)
       .lineWidth(3)
       .stroke(primaryColor);
    
    doc.rect(30, 30, pageWidth - 60, pageHeight - 60)
       .lineWidth(1)
       .stroke(goldColor);
  }

  public static addBackgroundPattern(doc: any) {
    const primaryColor = "#467EC7";
    
    for (let i = 0; i < 15; i++) {
      for (let j = 0; j < 10; j++) {
        doc.circle(60 + i * 50, 60 + j * 50, 1)
           .fillOpacity(0.05)
           .fill(primaryColor);
      }
    }
    doc.fillOpacity(1);
  }

  public static addCertificationText(doc: any, centerX: number) {
    const darkGray = "#2D3748";
    
    doc.fontSize(16)
       .fillColor(darkGray)
       .font('Helvetica')
       .text("This is to certify that", centerX - 200, 200, { width: 400, align: "center" });
  }

  public static addUserName(doc: any, centerX: number, userName: string) {
    const primaryColor = "#467EC7";
    const goldColor = "#FFD700";
    const darkGray = "#2D3748";

    doc.fontSize(32)
       .fillColor(primaryColor)
       .font('Helvetica-Bold')
       .text(userName, centerX - 250, 240, { width: 500, align: "center" });

    doc.fontSize(32);
    const nameWidth = doc.widthOfString(userName);
    doc.moveTo(centerX - nameWidth/2, 280)
       .lineTo(centerX + nameWidth/2, 280)
       .lineWidth(2)
       .stroke(goldColor);

    doc.fontSize(16)
       .fillColor(darkGray)
       .font('Helvetica')
       .text("has successfully completed the", centerX - 200, 310, { width: 400, align: "center" });
  }

  public static addAssessmentTitle(doc: any, centerX: number, assessmentTitle: string) {
    const secondaryColor = "#24CFA7";
    
    doc.fontSize(24)
       .fillColor(secondaryColor)
       .font('Helvetica-Bold')
       .text(assessmentTitle, centerX - 250, 340, { width: 500, align: "center" });
  }
}
