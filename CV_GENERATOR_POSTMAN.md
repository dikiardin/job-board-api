# 🧪 **CV Generator - Postman Testing Documentation**

## 📋 **Prerequisites**

### **1. Environment Setup**
Create a new Postman environment with these variables:

```json
{
  "baseUrl": "http://localhost:5000",
  "authToken": "YOUR_JWT_TOKEN_HERE",
  "userId": "YOUR_USER_ID_HERE",
  "cvId": "GENERATED_CV_ID_HERE"
}
```

### **2. Required Headers (Global)**
```
Content-Type: application/json
Authorization: Bearer {{authToken}}
```

---

## 🎯 **API Collection: CV Generator**

### **1. Get Available Templates**

#### **Request:**
```http
GET {{baseUrl}}/cv/templates
Authorization: Bearer {{authToken}}
```

#### **Expected Response (200 OK):**
```json
{
  "message": "Templates retrieved successfully",
  "data": [
    {
      "id": "ats",
      "name": "ATS-Friendly Template",
      "description": "Clean, professional template optimized for Applicant Tracking Systems",
      "preview": "/templates/ats-preview.png"
    },
    {
      "id": "modern",
      "name": "Modern Template",
      "description": "Contemporary design with visual elements and modern typography",
      "preview": "/templates/modern-preview.png"
    },
    {
      "id": "creative",
      "name": "Creative Template",
      "description": "Unique design for creative professionals with visual flair",
      "preview": "/templates/creative-preview.png"
    }
  ],
  "subscription": {
    "plan": "Professional",
    "availableTemplates": ["ats", "modern", "creative"],
    "cvLimit": "Unlimited"
  }
}
```

#### **Test Script:**
```javascript
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Response has templates array", function () {
    const jsonData = pm.response.json();
    pm.expect(jsonData.data).to.be.an('array');
    pm.expect(jsonData.data.length).to.be.greaterThan(0);
});

pm.test("Each template has required fields", function () {
    const jsonData = pm.response.json();
    jsonData.data.forEach(template => {
        pm.expect(template).to.have.property('id');
        pm.expect(template).to.have.property('name');
        pm.expect(template).to.have.property('description');
    });
});
```

---

### **2. Generate CV (Complete Example)**

#### **Request:**
```http
POST {{baseUrl}}/cv/generate
Authorization: Bearer {{authToken}}
Content-Type: application/json
```

#### **Request Body:**
```json
{
  "templateType": "ats",
  "additionalInfo": {
    "objective": "Fullstack Web Developer with hands-on experience from Purwadhika bootcamp, specializing in React.js, Next.js, Node.js, and MySQL. Successfully built projects such as an event management platform with real-time transactions and a corporate website optimization with modern UI and SEO improvements. Strong problem-solving and collaboration skills, with a passion for creating scalable and user-friendly digital solutions.",
    "linkedin": "www.linkedin.com/in/yourusername",
    "portfolio": "https://yourportfolio.com",
    "projects": [
      {
        "name": "Event Management Application (TicketNest)",
        "description": "Developed event management platform using Express.js Next.js 15, TypeScript, and Tailwind CSS with role-based authentication. Built transaction system with payment verification, automated status updates, and revenue tracking. Integrated Prisma ORM with PostgreSQL, Cloudinary for image management, and Nodemailer for notifications. Delivered responsive dashboard with event statistics and attendee management, improving organizer efficiency.",
        "technologies": ["Express.js", "Next.js 15", "TypeScript", "Tailwind CSS", "Prisma ORM", "PostgreSQL", "Cloudinary", "Nodemailer"],
        "url": "https://github.com/yourusername/ticketnest"
      },
      {
        "name": "Corporate Website Optimization – PT Bara Jaya Internasional",
        "description": "Optimized corporate website using Next.js 15 and TypeScript, improving performance and UX. Enhanced features with responsive UI components, interactive service sections, and blog functionality. Implemented dynamic content management, user authentication, and SEO optimization. Increased loading speed and visibility while maintaining brand consistency.",
        "technologies": ["Next.js 15", "TypeScript", "SEO", "Responsive Design"],
        "url": "https://github.com/yourusername/corporate-website"
      }
    ],
    "workExperience": [
      {
        "company": "Tech Startup Indonesia",
        "responsibilities": [
          "Developed and maintained web applications using React.js and Node.js for 50+ clients.",
          "Collaborated with cross-functional teams to deliver projects 20% faster than deadline.",
          "Implemented responsive design principles, improving mobile user experience by 35%.",
          "Optimized database queries and API performance, reducing load times by 40%."
        ]
      },
      {
        "company": "Digital Agency Jakarta",
        "responsibilities": [
          "Built custom WordPress themes and plugins for enterprise clients.",
          "Integrated third-party APIs including payment gateways and social media platforms.",
          "Managed client relationships and gathered requirements for 15+ projects.",
          "Implemented SEO best practices, improving client website rankings by average 60%."
        ]
      }
    ],
    "educationDetails": [
      {
        "institution": "Purwadhika Digital Technology School",
        "degree": "Fullstack Web Development Bootcamp",
        "year": "2024",
        "gpa": "3.85"
      },
      {
        "institution": "Universitas Indonesia",
        "degree": "Bachelor of Computer Science",
        "year": "2019-2023",
        "gpa": "3.67"
      }
    ],
    "certifications": [
      {
        "name": "Fullstack Web Development Certificate",
        "issuer": "Purwadhika Digital Technology School",
        "date": "Dec 2024",
        "link": "https://certificate.purwadhika.com/fullstack-2024"
      },
      {
        "name": "AWS Certified Developer Associate",
        "issuer": "Amazon Web Services",
        "date": "Nov 2024",
        "link": "https://aws.amazon.com/certification/certified-developer-associate"
      }
    ],
    "skills": [
      "HTML5", "CSS3", "JavaScript", "TypeScript", "React.js", "Next.js", 
      "Node.js", "Express.js", "MySQL", "PostgreSQL", "MongoDB", 
      "Git", "Docker", "AWS", "Vercel", "Jest", "Postman"
    ],
    "skillCategories": {
      "Frontend Development": ["html5", "css3", "javascript", "typescript", "react", "next"],
      "Backend Development": ["node", "express", "rest api", "authentication", "jwt"],
      "Database & Storage": ["mysql", "postgresql", "mongodb"],
      "DevOps & Tools": ["git", "docker", "aws", "vercel", "jest", "postman"],
      "Soft Skills": ["problem solving", "team collaboration", "leadership"]
    },
    "languages": [
      {
        "name": "Indonesian",
        "level": "Native"
      },
      {
        "name": "English",
        "level": "Advanced"
      }
    ]
  }
}
```

#### **Expected Response (201 Created):**
```json
{
  "message": "CV generated successfully",
  "data": {
    "id": 12,
    "fileUrl": "https://res.cloudinary.com/dluqjnhcm/raw/upload/v1758717572/cv-files/cv_uuid",
    "templateUsed": "ats",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

#### **Test Script:**
```javascript
pm.test("Status code is 201", function () {
    pm.response.to.have.status(201);
});

pm.test("CV generated successfully", function () {
    const jsonData = pm.response.json();
    pm.expect(jsonData.message).to.include("successfully");
    pm.expect(jsonData.data).to.have.property('id');
    pm.expect(jsonData.data).to.have.property('fileUrl');
    pm.expect(jsonData.data).to.have.property('templateUsed');
});

// Save CV ID for subsequent tests
pm.test("Save CV ID", function () {
    const jsonData = pm.response.json();
    pm.environment.set("cvId", jsonData.data.id);
});

pm.test("File URL is valid Cloudinary URL", function () {
    const jsonData = pm.response.json();
    pm.expect(jsonData.data.fileUrl).to.include("cloudinary.com");
});
```

---

### **3. Get User's CVs**

#### **Request:**
```http
GET {{baseUrl}}/cv
Authorization: Bearer {{authToken}}
```

#### **Expected Response (200 OK):**
```json
{
  "message": "CVs retrieved successfully",
  "data": [
    {
      "id": 12,
      "fileUrl": "https://res.cloudinary.com/dluqjnhcm/raw/upload/v1758717572/cv-files/cv_uuid",
      "templateUsed": "ats",
      "createdAt": "2024-01-15T10:30:00.000Z"
    },
    {
      "id": 11,
      "fileUrl": "https://res.cloudinary.com/dluqjnhcm/raw/upload/v1758716912/cv-files/cv_uuid2",
      "templateUsed": "modern",
      "createdAt": "2024-01-14T15:20:00.000Z"
    }
  ]
}
```

#### **Test Script:**
```javascript
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Response has CVs array", function () {
    const jsonData = pm.response.json();
    pm.expect(jsonData.data).to.be.an('array');
});

pm.test("Each CV has required fields", function () {
    const jsonData = pm.response.json();
    if (jsonData.data.length > 0) {
        jsonData.data.forEach(cv => {
            pm.expect(cv).to.have.property('id');
            pm.expect(cv).to.have.property('fileUrl');
            pm.expect(cv).to.have.property('templateUsed');
            pm.expect(cv).to.have.property('createdAt');
        });
    }
});
```

---

### **4. Get Specific CV Details**

#### **Request:**
```http
GET {{baseUrl}}/cv/{{cvId}}
Authorization: Bearer {{authToken}}
```

#### **Expected Response (200 OK):**
```json
{
  "message": "CV retrieved successfully",
  "data": {
    "id": 12,
    "fileUrl": "https://res.cloudinary.com/dluqjnhcm/raw/upload/v1758717572/cv-files/cv_uuid",
    "downloadUrl": "/cv/12/download",
    "publicUrl": "/cv/public/12/CV_12.pdf",
    "publicUrlDefault": "/cv/public/12",
    "originalUrl": "https://res.cloudinary.com/dluqjnhcm/raw/upload/v1758717572/cv-files/cv_uuid",
    "templateUsed": "ats",
    "additionalInfo": {
      "objective": "Fullstack Web Developer...",
      "projects": [...],
      "workExperience": [...],
      "educationDetails": [...],
      "certifications": [...],
      "skills": [...],
      "skillCategories": {...}
    },
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

#### **Test Script:**
```javascript
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("CV details retrieved", function () {
    const jsonData = pm.response.json();
    pm.expect(jsonData.data).to.have.property('downloadUrl');
    pm.expect(jsonData.data).to.have.property('publicUrl');
    pm.expect(jsonData.data).to.have.property('originalUrl');
    pm.expect(jsonData.data).to.have.property('additionalInfo');
});

pm.test("Download URLs are properly formatted", function () {
    const jsonData = pm.response.json();
    const cvId = jsonData.data.id;
    pm.expect(jsonData.data.downloadUrl).to.equal(`/cv/${cvId}/download`);
    pm.expect(jsonData.data.publicUrl).to.equal(`/cv/public/${cvId}/CV_${cvId}.pdf`);
});
```

---

### **5. Download CV (Auth Required)**

#### **Request:**
```http
GET {{baseUrl}}/cv/{{cvId}}/download
Authorization: Bearer {{authToken}}
```

#### **Expected Response (200 OK):**
- **Content-Type**: `application/pdf`
- **Content-Disposition**: `attachment; filename="CV_12.pdf"`
- **Content-Length**: File size in bytes
- **Body**: PDF file binary data

#### **Test Script:**
```javascript
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Response is PDF file", function () {
    pm.expect(pm.response.headers.get('Content-Type')).to.equal('application/pdf');
});

pm.test("Has attachment header", function () {
    const contentDisposition = pm.response.headers.get('Content-Disposition');
    pm.expect(contentDisposition).to.include('attachment');
    pm.expect(contentDisposition).to.include('.pdf');
});

pm.test("File size is reasonable", function () {
    const contentLength = parseInt(pm.response.headers.get('Content-Length'));
    pm.expect(contentLength).to.be.greaterThan(1000); // At least 1KB
    pm.expect(contentLength).to.be.lessThan(1000000); // Less than 1MB
});
```

---

### **6. Public Download CV (No Auth Required)**

#### **Request (Default Filename):**
```http
GET {{baseUrl}}/cv/public/{{cvId}}
```

#### **Request (Custom Filename):**
```http
GET {{baseUrl}}/cv/public/{{cvId}}/MyResume.pdf
```

#### **Expected Response (200 OK):**
- **Content-Type**: `application/pdf`
- **Content-Disposition**: `attachment; filename="CV_12.pdf"` or custom filename
- **Cache-Control**: `public, max-age=3600`
- **Body**: PDF file binary data

#### **Test Script:**
```javascript
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Public download works without auth", function () {
    pm.expect(pm.response.headers.get('Content-Type')).to.equal('application/pdf');
});

pm.test("Has caching headers", function () {
    const cacheControl = pm.response.headers.get('Cache-Control');
    pm.expect(cacheControl).to.include('public');
    pm.expect(cacheControl).to.include('max-age');
});
```

---

### **7. Delete CV**

#### **Request:**
```http
DELETE {{baseUrl}}/cv/{{cvId}}
Authorization: Bearer {{authToken}}
```

#### **Expected Response (200 OK):**
```json
{
  "message": "CV deleted successfully"
}
```

#### **Test Script:**
```javascript
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("CV deleted successfully", function () {
    const jsonData = pm.response.json();
    pm.expect(jsonData.message).to.include("deleted successfully");
});
```

---

## 🧪 **Test Scenarios**

### **Scenario 1: Complete CV Generation Flow**

Create a new folder "CV Generation Flow" with these requests in order:

1. **Get Templates** → Verify available templates
2. **Generate CV** → Create new CV with full data
3. **Get CV Details** → Verify CV was created with all URLs
4. **Download via API** → Test authenticated download
5. **Public Download** → Test public access
6. **Delete CV** → Clean up test data

### **Scenario 2: Validation Testing**

Create folder "Validation Tests":

#### **Missing Required Fields:**
```json
{
  "templateType": "ats"
  // Missing additionalInfo
}
```
Expected: `400 Bad Request`

#### **Invalid Template:**
```json
{
  "templateType": "invalid_template",
  "additionalInfo": {...}
}
```
Expected: `400 Bad Request`

#### **Too Many Skills:**
```json
{
  "templateType": "ats",
  "additionalInfo": {
    "skills": ["skill1", "skill2", ...] // More than 20 skills
  }
}
```
Expected: `400 Bad Request`

### **Scenario 3: Authentication Testing**

Create folder "Auth Tests":

#### **No Token:**
```http
GET {{baseUrl}}/cv/templates
# Remove Authorization header
```
Expected: `401 Unauthorized`

#### **Invalid Token:**
```http
GET {{baseUrl}}/cv/templates
Authorization: Bearer invalid_token_here
```
Expected: `401 Unauthorized`

#### **Public Access (Should Work):**
```http
GET {{baseUrl}}/cv/public/12/CV_12.pdf
# No Authorization header needed
```
Expected: `200 OK` with PDF

### **Scenario 4: Error Handling**

Create folder "Error Tests":

#### **CV Not Found:**
```http
GET {{baseUrl}}/cv/99999
Authorization: Bearer {{authToken}}
```
Expected: `404 Not Found`

#### **Access Other User's CV:**
```http
GET {{baseUrl}}/cv/1
Authorization: Bearer {{otherUserToken}}
```
Expected: `404 Not Found` (for security)

---

## 📊 **Performance Testing**

### **Load Test Collection:**

#### **Concurrent CV Generation:**
```javascript
// Pre-request Script
const iterations = 5;
for (let i = 0; i < iterations; i++) {
    setTimeout(() => {
        pm.sendRequest({
            url: pm.environment.get("baseUrl") + "/cv/generate",
            method: "POST",
            header: {
                "Authorization": "Bearer " + pm.environment.get("authToken"),
                "Content-Type": "application/json"
            },
            body: {
                mode: "raw",
                raw: JSON.stringify({
                    templateType: "ats",
                    additionalInfo: {...}
                })
            }
        });
    }, i * 100);
}
```

#### **File Size Monitoring:**
```javascript
pm.test("PDF file size is optimal", function () {
    const contentLength = parseInt(pm.response.headers.get('Content-Length'));
    console.log("PDF file size:", contentLength, "bytes");
    
    // Log for monitoring
    pm.globals.set("lastPdfSize", contentLength);
    
    // Reasonable size checks
    pm.expect(contentLength).to.be.greaterThan(2000); // At least 2KB
    pm.expect(contentLength).to.be.lessThan(50000); // Less than 50KB
});
```

---

## 🔍 **Debug & Monitoring**

### **Console Logging:**
Add this to test scripts for debugging:

```javascript
// Log response time
console.log("Response time:", pm.response.responseTime + "ms");

// Log response size
console.log("Response size:", pm.response.responseSize + " bytes");

// Log specific data
const jsonData = pm.response.json();
console.log("CV ID:", jsonData.data?.id);
console.log("File URL:", jsonData.data?.fileUrl);
```

### **Environment Monitoring:**
```javascript
// Check environment variables
pm.test("Environment setup", function () {
    pm.expect(pm.environment.get("baseUrl")).to.not.be.undefined;
    pm.expect(pm.environment.get("authToken")).to.not.be.undefined;
});
```

---

## 📋 **Postman Collection Export**

### **Collection Structure:**
```
📁 CV Generator API
├── 📁 Setup & Auth
│   ├── Get Auth Token
│   └── Verify Token
├── 📁 CV Operations
│   ├── Get Templates
│   ├── Generate CV
│   ├── Get User CVs
│   ├── Get CV Details
│   └── Delete CV
├── 📁 Download Tests
│   ├── Auth Download
│   ├── Public Download (Default)
│   └── Public Download (Custom)
├── 📁 Validation Tests
│   ├── Missing Fields
│   ├── Invalid Template
│   └── Invalid Data
├── 📁 Error Handling
│   ├── Unauthorized Access
│   ├── CV Not Found
│   └── Server Errors
└── 📁 Performance Tests
    ├── Load Test
    └── File Size Monitor
```

### **Import Instructions:**
1. Download collection JSON
2. Import to Postman
3. Set environment variables
4. Run individual tests or entire collection
5. Monitor results in Test Results tab

---

**🎯 Complete Postman testing suite ready for CV Generator API!**
