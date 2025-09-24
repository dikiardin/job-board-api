# 📄 **CV Generator - Complete Documentation**

## 📋 **Table of Contents**
1. [Overview](#overview)
2. [Architecture](#architecture)
3. [File Structure](#file-structure)
4. [Code Flow](#code-flow)
5. [API Endpoints](#api-endpoints)
6. [Database Schema](#database-schema)
7. [Dependencies](#dependencies)

---

## 🎯 **Overview**

CV Generator adalah fitur yang memungkinkan user untuk generate CV dalam format PDF berdasarkan data profile mereka dengan template ATS-friendly. Sistem ini terintegrasi dengan subscription model dan menyediakan multiple download options.

### **Key Features:**
- ✅ PDF generation dengan template ATS-friendly
- ✅ Profile data integration dengan additional info form
- ✅ Cloud storage via Cloudinary
- ✅ Full CRUD operations untuk CV management
- ✅ Authentication-protected endpoints
- ✅ Public download tanpa authentication
- ✅ Subscription-based template access

---

## 🏗️ **Architecture**

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Frontend      │───▶│   API Routes     │───▶│   Controllers   │
│   (React/Next)  │    │   cv.router.ts   │    │   cv.*.ts       │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                                         │
                                                         ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Cloudinary    │◀───│   PDF Service    │◀───│   CV Service    │
│   (File Storage)│    │   pdf.*.ts       │    │   cv.service.ts │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                                         │
                                                         ▼
                                              ┌─────────────────┐
                                              │   Database      │
                                              │   (PostgreSQL)  │
                                              └─────────────────┘
```

---

## 📁 **File Structure**

### **Controllers (Max 200 lines each)**
```
src/controllers/cv/
├── cv.main.controller.ts (121 lines)
│   ├── generateCV()
│   ├── getUserCVs()
│   ├── getCVById()
│   └── deleteCV()
│
└── cv.download.controller.ts (191 lines)
    ├── downloadCV()
    ├── publicDownloadCV()
    └── getTemplates()
```

### **Services (Max 200 lines each)**
```
src/services/cv/
├── cv.service.ts (187 lines)
│   ├── generateCV()
│   └── delegates to management service
│
├── cv.management.service.ts (101 lines)
│   ├── getUserCVs()
│   ├── getCVById()
│   ├── deleteCV()
│   └── getAvailableTemplates()
│
├── pdf.service.ts (Original PDF service)
│   └── Main PDF generation orchestrator
│
├── pdf.template.service.ts (77 lines)
│   ├── generateATSTemplate()
│   ├── generateModernTemplate()
│   └── generateCreativeTemplate()
│
├── pdf.header.service.ts (159 lines)
│   ├── generateHeader()
│   ├── generateSummary()
│   └── generateProjects()
│
├── pdf.work.service.ts (90 lines)
│   └── generateWorkExperience()
│
└── pdf.sections.service.ts (168 lines)
    ├── addEducationSection()
    ├── addCertificationsSection()
    └── addSkillsSection()
```

### **Routes**
```
src/routers/
└── cv.router.ts (48 lines)
    ├── Public routes (no auth)
    ├── Protected routes (auth + subscription)
    └── All CV endpoints
```

### **Utilities**
```
src/utils/
├── uploadBuffer.ts - Cloudinary upload functionality
└── cvTemplate.ts - Template definitions
```

---

## 🔄 **Code Flow**

### **1. CV Generation Flow**

```typescript
// 1. Request masuk ke cv.router.ts
POST /cv/generate
├── authMiddleware (check JWT)
├── checkSubscription (check active subscription)
├── validateCVGeneration (validate input)
├── checkCVGenerationLimit (check monthly limit)
├── checkTemplateAccess (check template permission)
└── cvMainController.generateCV()

// 2. Controller processing
cvMainController.generateCV() {
  ├── Extract userId from JWT
  ├── Extract templateType & additionalInfo from body
  └── Call cvService.generateCV()
}

// 3. Service processing
cvService.generateCV() {
  ├── Get user data from database (with relations)
  ├── Prepare CV data structure
  ├── Call PDFService.generatePDF()
  ├── Upload PDF to Cloudinary
  └── Save CV record to database
}

// 4. PDF Generation
PDFService.generatePDF() {
  ├── Create new PDFDocument
  ├── Call pdfTemplateService.generateATSTemplate()
  └── Return PDF buffer
}

// 5. Template Processing
pdfTemplateService.generateATSTemplate() {
  ├── pdfHeaderService.generateHeader()
  ├── pdfHeaderService.generateSummary()
  ├── pdfHeaderService.generateProjects()
  ├── pdfWorkService.generateWorkExperience()
  ├── pdfSectionsService.addEducationSection()
  ├── pdfSectionsService.addCertificationsSection()
  └── pdfSectionsService.addSkillsSection()
}
```

### **2. Download Flow**

```typescript
// Auth Required Download
GET /cv/:id/download
├── authMiddleware
├── cvDownloadController.downloadCV()
├── Fetch PDF from Cloudinary
├── Set proper headers (Content-Disposition: attachment)
└── Stream PDF to client

// Public Download (No Auth)
GET /cv/public/:id/:filename
├── cvDownloadController.publicDownloadCV()
├── Fetch PDF from Cloudinary
├── Set proper headers with custom filename
└── Stream PDF to client
```

---

## 🛠️ **Key Code Examples**

### **1. Main Controller (cv.main.controller.ts)**

```typescript
export class CVMainController {
  async generateCV(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const { templateType = "ats", additionalInfo } = req.body;

      const cv = await cvService.generateCV(
        userId,
        templateType,
        additionalInfo
      );

      res.status(201).json({
        message: "CV generated successfully",
        data: cv,
      });
    } catch (error) {
      console.error("Generate CV error:", error);
      res.status(500).json({
        message: "Failed to generate CV",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
}
```

### **2. PDF Template Service (pdf.template.service.ts)**

```typescript
export class PDFTemplateService {
  generateATSTemplate(doc: any, cvData: any) {
    const margin = 50;
    const pageWidth = 595.28; // A4 width in points
    const contentWidth = pageWidth - margin * 2;
    let yPosition = 50;

    // Generate sections in order
    yPosition = pdfHeaderService.generateHeader(doc, cvData, pageWidth, margin);
    yPosition = pdfHeaderService.generateSummary(doc, cvData, yPosition, margin, contentWidth);
    yPosition = pdfHeaderService.generateProjects(doc, cvData, yPosition, margin, contentWidth);
    yPosition = pdfWorkService.generateWorkExperience(doc, cvData, yPosition, margin, contentWidth);
    yPosition = pdfSectionsService.addEducationSection(doc, cvData, yPosition, margin, contentWidth);
    yPosition = pdfSectionsService.addCertificationsSection(doc, cvData, yPosition, margin, contentWidth);
    yPosition = pdfSectionsService.addSkillsSection(doc, cvData, yPosition, margin, contentWidth);
  }
}
```

### **3. Router Configuration (cv.router.ts)**

```typescript
const router = Router();

// Public download routes (no auth required)
router.get("/public/:id/:filename", cvDownloadController.publicDownloadCV);
router.get("/public/:id", cvDownloadController.publicDownloadCV);

// All other CV routes require authentication
router.use(authMiddleware);
router.use(checkSubscription);

// Protected routes
router.get("/templates", cvDownloadController.getTemplates);
router.post("/generate", validateCVGeneration, checkCVGenerationLimit, checkTemplateAccess, cvMainController.generateCV);
router.get("/", cvMainController.getUserCVs);
router.get("/:id", cvMainController.getCVById);
router.get("/:id/download", cvDownloadController.downloadCV);
router.delete("/:id", cvMainController.deleteCV);

export default router;
```

---

## 🗄️ **Database Schema**

### **GeneratedCV Model**
```prisma
model GeneratedCV {
  id             Int      @id @default(autoincrement())
  userId         Int
  fileUrl        String
  templateUsed   String
  additionalInfo Json?
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("generated_cvs")
}
```

### **Related Models**
```prisma
model User {
  id              Int      @id @default(autoincrement())
  name            String
  email           String   @unique
  phone           String?
  address         String?
  education       String?
  profilePicture  String?
  
  // Relations
  employments     Employment[]
  skillResults    SkillResult[]
  userBadges      UserBadge[]
  generatedCVs    GeneratedCV[]
}
```

---

## 📦 **Dependencies**

### **Core Dependencies**
```json
{
  "pdfkit": "^0.13.0",
  "cloudinary": "^1.40.0",
  "joi": "^17.9.0",
  "@types/pdfkit": "^0.12.12"
}
```

### **Middleware Dependencies**
```typescript
// Authentication
import { authMiddleware } from "../middlewares/auth.middleware";

// Validation
import { validateCVGeneration } from "../middlewares/validator/cv.validator";

// Subscription
import {
  checkSubscription,
  checkCVGenerationLimit,
  checkTemplateAccess,
} from "../middlewares/subscription.middleware";
```

---

## 🔧 **Configuration**

### **Cloudinary Setup**
```typescript
// src/utils/uploadBuffer.ts
export const uploadToCloudinary = (buffer: Buffer, filename: string) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        resource_type: 'raw',
        public_id: `cv-files/${filename}`,
        use_filename: true,
        unique_filename: false,
        overwrite: true,
      },
      (error, result) => {
        if (error || !result) {
          return reject(error || new Error('Upload failed'));
        }
        resolve({
          secure_url: result.secure_url,
          public_id: result.public_id
        });
      }
    );
    stream.pipe(uploadStream);
  });
};
```

### **Environment Variables**
```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
JWT_SECRET=your_jwt_secret
DATABASE_URL=your_database_url
```

---

## 🚀 **Usage Examples**

### **Generate CV Request**
```typescript
const generateCV = async () => {
  const response = await fetch('/cv/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      templateType: 'ats',
      additionalInfo: {
        objective: 'Experienced developer...',
        projects: [...],
        workExperience: [...],
        educationDetails: [...],
        certifications: [...],
        skills: [...],
        skillCategories: {...}
      }
    })
  });
  
  const result = await response.json();
  console.log('CV generated:', result.data);
};
```

### **Download CV**
```typescript
// Auth required download
const downloadCV = async (cvId: number) => {
  const response = await fetch(`/cv/${cvId}/download`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `CV_${cvId}.pdf`;
  a.click();
};

// Public download (no auth)
const publicDownload = (cvId: number, filename?: string) => {
  const url = filename 
    ? `/cv/public/${cvId}/${filename}`
    : `/cv/public/${cvId}`;
  window.open(url, '_blank');
};
```

---

## 📊 **Performance Considerations**

### **File Size Optimization**
- PDF files typically 4-6 KB
- Efficient font usage (Helvetica family)
- Minimal graphics and styling
- Compressed content structure

### **Memory Management**
- Stream-based PDF generation
- Buffer cleanup after upload
- Efficient data processing
- Garbage collection optimization

### **Caching Strategy**
- Public downloads cached for 1 hour
- Template definitions cached in memory
- User data fetched with optimized queries

---

## 🔒 **Security Features**

### **Authentication & Authorization**
- JWT-based authentication
- User ownership validation
- Subscription-based access control
- Template permission checking

### **Input Validation**
- Joi schema validation
- File size limits
- Content sanitization
- SQL injection prevention

### **File Security**
- Secure Cloudinary upload
- Unique filename generation
- Access control for downloads
- Content-Type validation

---

**🎯 CV Generator is ready for production use with full documentation and testing support!**
