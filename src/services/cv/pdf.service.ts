import { CVData } from './cv.service';
import { uploadToCloudinary } from '../../utils/uploadBuffer';
import { smartSkillCategorization } from '../../utils/cvTemplate';
import { v4 as uuidv4 } from 'uuid';
const PDFDocument = require('pdfkit');
import { Readable } from 'stream';

export class PDFService {
  async generatePDF(cvData: CVData, templateType: string = 'ats'): Promise<string> {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument();
        const buffers: Buffer[] = [];

        doc.on('data', (chunk: Buffer) => buffers.push(chunk));
        doc.on('end', async () => {
          try {
            const pdfBuffer = Buffer.concat(buffers);
            
            // Debug: Check if PDF buffer is valid
            console.log('PDF Buffer size:', pdfBuffer.length);
            console.log('PDF Buffer starts with PDF header:', pdfBuffer.toString('ascii', 0, 4) === '%PDF');
            console.log('PDF Buffer first 20 bytes:', pdfBuffer.toString('ascii', 0, 20));
            
            // Validate PDF buffer
            if (pdfBuffer.length === 0) {
              throw new Error('PDF buffer is empty');
            }
            
            if (!pdfBuffer.toString('ascii', 0, 4).startsWith('%PDF')) {
              throw new Error('Invalid PDF buffer - missing PDF header');
            }
            
            const fileName = `cv-files/cv_${uuidv4()}.pdf`;
            console.log('Uploading PDF with filename:', fileName);
            
            const result = await uploadToCloudinary(
              Readable.from(pdfBuffer),
              fileName
            );
            
            console.log('PDF uploaded successfully to:', result.secure_url);
            resolve(result.secure_url);
          } catch (error) {
            console.error('PDF upload error:', error);
            reject(error);
          }
        });

        // Generate content based on template type
        this.generateATSTemplate(doc, cvData);
        doc.end();
      } catch (error) {
        reject(error);
      }
    });
  }

  private addSectionHeader(doc: any, title: string, yPosition: number, margin: number, contentWidth: number) {
    doc.fontSize(14).font('Helvetica-Bold').text(title, margin, yPosition);
    
    // Add underline
    const titleWidth = doc.widthOfString(title);
    doc.strokeColor('#000000').lineWidth(0.5);
    doc.moveTo(margin, yPosition + 18).lineTo(margin + titleWidth, yPosition + 18).stroke();
  }


  private generateATSTemplate(doc: any, cvData: CVData) {
    let yPosition = 50;
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

    // Header - Name (Centered, Bold, 16pt)
    doc.fontSize(16).font('Helvetica-Bold');
    const nameWidth = doc.widthOfString(cvData.personalInfo.name);
    doc.text(cvData.personalInfo.name, (pageWidth - nameWidth) / 2, yPosition);
    yPosition += 20;

    // Job Title/Position (Centered, 12pt)
    const jobTitle = cvData.additionalInfo?.objective ? 
      cvData.additionalInfo.objective.split('.')[0] : 'Fullstack Web Developer';
    doc.fontSize(12).font('Helvetica');
    const titleWidth = doc.widthOfString(jobTitle);
    doc.text(jobTitle, (pageWidth - titleWidth) / 2, yPosition);
    yPosition += 15;

    // Contact Information (Centered, single line with separators, 10pt)
    const contactInfo = [];
    if (cvData.personalInfo.address) contactInfo.push(cvData.personalInfo.address);
    if (cvData.personalInfo.phone) contactInfo.push(cvData.personalInfo.phone);
    if (cvData.personalInfo.email) contactInfo.push(cvData.personalInfo.email);
    
    // Add LinkedIn if available
    if (cvData.additionalInfo?.linkedin) {
      contactInfo.push(cvData.additionalInfo.linkedin);
    }
    
    // Add Portfolio if available
    if (cvData.additionalInfo?.portfolio) {
      contactInfo.push(cvData.additionalInfo.portfolio);
    }
    
    if (contactInfo.length > 0) {
      const contactLine = contactInfo.join(' | ');
      doc.fontSize(10).font('Helvetica');
      const contactWidth = doc.widthOfString(contactLine);
      doc.text(contactLine, (pageWidth - contactWidth) / 2, yPosition);
      yPosition += 30;
    } else {
      yPosition += 20;
    }

    // SUMMARY Section
    if (cvData.additionalInfo?.objective) {
      this.addSectionHeader(doc, 'SUMMARY', yPosition, margin, contentWidth);
      yPosition += 20;
      doc.fontSize(10).font('Helvetica').text(cvData.additionalInfo.objective, margin, yPosition, {
        width: contentWidth,
        align: 'left',
        lineGap: 2
      });
      yPosition += doc.heightOfString(cvData.additionalInfo.objective, { width: contentWidth, lineGap: 2 }) + 15;
    }

    // PROJECT EXPERIENCE Section (prioritized over work experience)
    if (cvData.additionalInfo?.projects && cvData.additionalInfo.projects.length > 0) {
      this.addSectionHeader(doc, 'PROJECT EXPERIENCE', yPosition, margin, contentWidth);
      yPosition += 20;
      
      cvData.additionalInfo.projects.forEach((project, index) => {
        // Check if we need a new page
        if (yPosition > 650) {
          doc.addPage();
          yPosition = 50;
        }

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

    // WORK EXPERIENCE Section
    console.log('Checking WORK EXPERIENCE section...');
    console.log('Work Experience data:', cvData.additionalInfo?.workExperience);
    console.log('Current yPosition before WORK EXPERIENCE:', yPosition);
    
    if (cvData.additionalInfo?.workExperience && cvData.additionalInfo.workExperience.length > 0) {
      console.log('WORK EXPERIENCE section will be added');
      
      // Check if we need a new page before starting work experience
      if (yPosition > 650) {
        console.log('Adding new page for WORK EXPERIENCE');
        doc.addPage();
        yPosition = 50;
      }
      
      this.addSectionHeader(doc, 'WORK EXPERIENCE', yPosition, margin, contentWidth);
      yPosition += 20;

      cvData.additionalInfo.workExperience.forEach((workExp: any, index: number) => {
        console.log(`Adding work experience ${index + 1}:`, workExp.company);
        
        // Check if we need a new page
        if (yPosition > 700) {
          doc.addPage();
          yPosition = 50;
        }

        // Company Name (Bold, 11pt)
        doc.fontSize(11).font('Helvetica-Bold').text(workExp.company, margin, yPosition);
        yPosition += 12;

        // Add responsibilities
        if (workExp.responsibilities && workExp.responsibilities.length > 0) {
          workExp.responsibilities.forEach((responsibility: string) => {
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
    } else {
      console.log('WORK EXPERIENCE section SKIPPED - no data found');
    }

    // EDUCATION Section
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
      } else if (cvData.education) {
        // Fallback to basic education
        console.log('Using fallback education:', cvData.education);
        doc.fontSize(11).font('Helvetica-Bold').text(cvData.education, margin, yPosition);
        yPosition += 12;
      }
      yPosition += 15; // Space after entire section
      console.log('EDUCATION section completed, yPosition:', yPosition);
    } else {
      console.log('EDUCATION section SKIPPED - no data found');
    }

    // LICENSES & CERTIFICATION Section
    if (cvData.additionalInfo?.certifications && cvData.additionalInfo.certifications.length > 0) {
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
        } else {
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

    // SKILLS Section
    const allSkills = [...(cvData.skills || [])];
    if (cvData.additionalInfo?.skills?.length) {
      allSkills.push(...cvData.additionalInfo.skills);
    }

    if (allSkills.length > 0) {
      this.addSectionHeader(doc, 'SKILLS', yPosition, margin, contentWidth);
      yPosition += 20;
      
      // Use universal skill categorization system
      const customCategories = cvData.additionalInfo?.skillCategories;
      const { categorized, uncategorized } = smartSkillCategorization(allSkills, customCategories);

      // Display skills based on user-defined categories or default format
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
      } else {
        // No custom categories - display all skills in clean comma-separated format
        const skillsPerLine = 10; // More skills per line for compact layout
        const skillChunks = [];
        
        for (let i = 0; i < allSkills.length; i += skillsPerLine) {
          skillChunks.push(allSkills.slice(i, i + skillsPerLine));
        }

        skillChunks.forEach((chunk) => {
          const skillLine = chunk.join(', ');
          doc.fontSize(10).font('Helvetica').text(skillLine, margin, yPosition, {
            width: contentWidth,
            align: 'left'
          });
          yPosition += 12;
        });
      }
    }

  }

}

export const pdfService = new PDFService();
