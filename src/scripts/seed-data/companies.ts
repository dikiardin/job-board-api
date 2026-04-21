import {
  Prisma,
  PrismaClient,
  PreselectionTest,
  Job,
  Company,
} from "../../generated/prisma";
import { SeedUsersResult } from "./users";
import { buildMCQ } from "./questionUtils";

interface SeedCompaniesOptions {
  prisma: PrismaClient;
  now: Date;
  addDays: (days: number) => Date;
  users: SeedUsersResult;
}

type AdminKey = keyof SeedUsersResult["admins"];

const companySeeds = [
  {
    key: "techCorp" as const,
    ownerKey: "tech" as AdminKey,
    name: "Gojek",
    email: "careers@gojek.com",
    phone: "+622150960800",
    description:
      '<h3>About Gojek</h3><p>Gojek is <strong>Indonesia\'s first decacorn</strong> and Southeast Asia\'s leading on-demand multi-service platform. Founded in 2010 by Nadiem Makarim, Gojek started as a motorcycle ride-hailing call centre and has evolved into a <strong>super app</strong> providing over 20+ services including transportation, food delivery, logistics, payments, and entertainment.</p><h4>Our Products</h4><ul><li><strong>GoRide &amp; GoCar:</strong> On-demand transportation</li><li><strong>GoFood:</strong> Southeast Asia\'s largest food delivery service</li><li><strong>GoPay &amp; GoPayLater:</strong> Digital payments and financial services</li><li><strong>GoSend:</strong> Instant courier and logistics</li></ul><h4>Engineering Culture</h4><ul><li><strong>Scale:</strong> Serving millions of daily transactions across Southeast Asia</li><li><strong>Innovation:</strong> Building distributed systems, ML platforms, and real-time mapping</li><li><strong>Impact:</strong> Empowering 2 million+ driver-partners and 900,000+ merchant partners</li><li><strong>Team:</strong> 5,000+ employees across Jakarta, Bangalore, Singapore, and Bangkok</li></ul><p>Join our world-class engineering team and build technology that moves Southeast Asia forward.</p>',
    logoUrl: "https://cdn.brandfetch.io/id8Ij7QgJl/w/400/h/400/theme/dark/icon.jpeg?c=1bxid64Mup7aczewSAYMX&t=1770035693484",
    bannerUrl: "https://placehold.co/1200x400/00AA13/ffffff?text=Gojek",
    website: "https://www.gojek.com",
    locationCity: "Jakarta",
    locationProvince: "DKI Jakarta",
    address: "Pasaraya Blok M, Jl. Iskandarsyah II No.7, Jakarta Selatan 12160",
    socials: {
      linkedin: "https://linkedin.com/company/gojek",
      instagram: "https://instagram.com/gojek",
      twitter: "https://twitter.com/goabordjek",
    } as Prisma.JsonObject,
  },
  {
    key: "creativeStudio" as const,
    ownerKey: "creative" as AdminKey,
    name: "Traveloka",
    email: "careers@traveloka.com",
    phone: "+622129103300",
    description:
      '<h3>About Traveloka</h3><p>Traveloka is <strong>Southeast Asia\'s leading travel and lifestyle platform</strong>, founded in 2012 by Ferry Unardi, Derianto Kusuma, and Albert Zhang. What started as a flight search engine has grown into a comprehensive platform serving over <strong>100 million downloads</strong> across the region.</p><h4>Our Services</h4><ul><li><strong>Flights &amp; Hotels:</strong> Comprehensive booking for domestic and international travel</li><li><strong>Xperience:</strong> Activities, attractions, and local experiences</li><li><strong>Eats:</strong> Restaurant discovery and reservations</li><li><strong>Financial Services:</strong> PayLater, insurance, and travel financing</li></ul><h4>Design &amp; Product Excellence</h4><p>Traveloka is renowned for its <strong>award-winning user experience</strong> and design-driven product culture:</p><ul><li>Winner of multiple <strong>Google Play Best App</strong> awards</li><li>World-class design team of <strong>100+ designers</strong> across UX research, product design, brand, and content</li><li>Data-driven design decisions backed by A/B testing and user research</li><li>Collaborative culture between design, engineering, and product teams</li></ul><p>Join us in crafting seamless travel experiences for millions of users across Southeast Asia.</p>',
    logoUrl: "https://cdn.brandfetch.io/idN9w9iZUZ/w/400/h/400/theme/dark/icon.jpeg?c=1bxid64Mup7aczewSAYMX&t=1701100241234",
    bannerUrl: "https://placehold.co/1200x400/0064D2/ffffff?text=Traveloka",
    website: "https://www.traveloka.com",
    locationCity: "Jakarta",
    locationProvince: "DKI Jakarta",
    address: "Jl. Pluit Selatan Raya, Penjaringan, Jakarta Utara 14440",
    socials: {
      linkedin: "https://linkedin.com/company/traveloka",
      instagram: "https://instagram.com/traveloka",
      twitter: "https://twitter.com/traveloka",
    } as Prisma.JsonObject,
  },
  {
    key: "fintechLabs" as const,
    ownerKey: "fintech" as AdminKey,
    name: "Dana Indonesia",
    email: "careers@dana.id",
    phone: "+622150818888",
    description:
      '<h3>About Dana Indonesia</h3><p>DANA is <strong>Indonesia\'s leading digital wallet</strong> and financial services platform, launched in 2018. Licensed and regulated by <strong>Bank Indonesia</strong>, DANA provides secure, fast, and accessible digital payment solutions for individuals and businesses across Indonesia.</p><h4>Our Services</h4><ul><li><strong>Digital Wallet:</strong> Peer-to-peer transfers, bill payments, and top-ups</li><li><strong>QRIS Payments:</strong> QR code-based merchant payments nationwide</li><li><strong>Dana Bisnis:</strong> Business payment solutions for merchants and enterprises</li><li><strong>Dana Cicil:</strong> Buy Now Pay Later and micro-lending services</li></ul><h4>Our Impact</h4><ul><li><strong>150+ million registered users</strong> across Indonesia</li><li><strong>10+ million merchant partners</strong> accepting DANA payments</li><li>Processing <strong>billions of transactions</strong> annually</li><li>Strategic partnerships with Lazada, Bukalapak, and major retailers</li></ul><h4>Technology &amp; Innovation</h4><p>Our engineering team builds <strong>high-performance, secure fintech infrastructure</strong> handling millions of concurrent transactions with 99.99% uptime. We leverage machine learning for fraud detection, real-time risk scoring, and personalized financial recommendations.</p>',
    logoUrl: "https://i.pinimg.com/736x/f5/8c/a3/f58ca3528b238877e9855fcac1daa328.jpg",
    bannerUrl: "https://placehold.co/1200x400/108EE9/ffffff?text=Dana+Indonesia",
    website: "https://www.dana.id",
    locationCity: "Jakarta",
    locationProvince: "DKI Jakarta",
    address: "Jl. Wolter Monginsidi No.3, Kebayoran Baru, Jakarta Selatan 12170",
    socials: {
      linkedin: "https://linkedin.com/company/dana-indonesia",
      instagram: "https://instagram.com/dana.id",
      twitter: "https://twitter.com/danawallet",
    } as Prisma.JsonObject,
  },
] as const;

// ─── Jobs with FIXED deadlines across 2026, 2027, 2028, 2029 ───────────────

const jobSeeds = [
  // ── 2026 Deadlines ───────────────────────────────────────────────────────
  {
    key: "frontend" as const,
    companyKey: "techCorp" as const,
    title: "Senior Frontend Engineer",
    description:
      '<h3>About the Role</h3><p>We are seeking a <strong>Senior Frontend Engineer</strong> to lead our frontend development team and drive the technical direction of our client-facing applications. You will architect scalable, performant, and accessible web applications using React, TypeScript, and Next.js.</p><h4>Key Responsibilities</h4><ul><li>Architect scalable and performant web applications</li><li>Mentor junior developers and conduct code reviews</li><li>Implement best practices for performance optimization</li><li>Ensure cross-browser compatibility and accessibility</li><li>Collaborate with product managers, designers, and backend engineers</li></ul><h4>Required Qualifications</h4><ul><li><strong>5+ years</strong> of frontend development experience</li><li>Strong expertise in <strong>React ecosystem</strong> (React, Next.js, Zustand/Redux)</li><li>Advanced <strong>TypeScript</strong> skills</li><li>Experience with testing frameworks (Jest, Playwright)</li><li>Knowledge of CI/CD and modern build tools (Vite, Webpack)</li></ul><h4>What We Offer</h4><ul><li>Competitive salary with performance bonuses</li><li>Remote-friendly work environment</li><li>Annual learning budget of IDR 10,000,000</li><li>Health insurance for employee and family</li></ul>',
    category: "Engineering",
    employmentType: "Full-time",
    experienceLevel: "Senior",
    city: "Jakarta",
    province: "DKI Jakarta",
    salaryMin: 25_000_000,
    salaryMax: 35_000_000,
    tags: ["react", "typescript", "next.js", "frontend", "javascript"],
    bannerUrl: "https://placehold.co/960x360/24CFA7/ffffff?text=Senior+Frontend+Engineer",
    applyDeadline: "2026-09-30",
    isPublished: true,
  },
  {
    key: "dataScientist" as const,
    companyKey: "techCorp" as const,
    title: "Data Scientist",
    description:
      '<h3>About the Role</h3><p>Join our data science team as a <strong>Data Scientist</strong> to build predictive analytics and machine learning models for enterprise clients. You will work with large datasets to extract insights and create data-driven recommendations.</p><h4>Key Responsibilities</h4><ul><li>Data collection, cleaning, and preprocessing</li><li>Exploratory data analysis and visualization</li><li>Feature engineering and ML model development</li><li>Model validation and performance tuning</li><li>Present findings to non-technical stakeholders</li></ul><h4>Required Skills</h4><ul><li><strong>Programming:</strong> Python, R, SQL</li><li><strong>ML Frameworks:</strong> scikit-learn, TensorFlow, PyTorch</li><li><strong>Analytics:</strong> Pandas, NumPy, Matplotlib, Seaborn</li><li><strong>3+ years</strong> in data science or analytics</li><li>Degree in Statistics, Mathematics, or Computer Science</li></ul>',
    category: "Data",
    employmentType: "Full-time",
    experienceLevel: "Mid",
    city: "Jakarta",
    province: "DKI Jakarta",
    salaryMin: 20_000_000,
    salaryMax: 28_000_000,
    tags: ["python", "machine-learning", "sql", "data-science", "tensorflow"],
    bannerUrl: "https://placehold.co/960x360/467EC7/ffffff?text=Data+Scientist",
    applyDeadline: "2026-12-15",
    isPublished: true,
  },
  {
    key: "uxDesigner" as const,
    companyKey: "creativeStudio" as const,
    title: "UX Designer",
    description:
      '<h3>About the Role</h3><p>We are looking for a talented <strong>UX Designer</strong> to lead user experience design projects across our diverse client portfolio including e-commerce, fintech, healthcare, and education technology.</p><h4>Key Responsibilities</h4><ul><li>Conduct user research and usability testing</li><li>Create user personas, journey maps, and empathy maps</li><li>Design wireframes and interactive prototypes in Figma</li><li>Develop information architecture and interaction flows</li><li>Create and maintain design systems</li><li>Present design solutions to clients and stakeholders</li></ul><h4>Required Skills</h4><ul><li><strong>Design Tools:</strong> Figma, Sketch, Adobe XD</li><li><strong>Research:</strong> User interviews, usability testing, A/B testing</li><li><strong>Portfolio:</strong> Strong demonstration of user-centered design thinking</li><li><strong>2-3 years</strong> of UX design experience</li></ul>',
    category: "Design",
    employmentType: "Contract",
    experienceLevel: "Intermediate",
    city: "Bandung",
    province: "Jawa Barat",
    salaryMin: 12_000_000,
    salaryMax: 18_000_000,
    tags: ["ux", "figma", "user-research", "design-thinking", "wireframing"],
    bannerUrl: "https://placehold.co/960x360/FF6B6B/ffffff?text=UX+Designer",
    applyDeadline: "2026-08-31",
    isPublished: true,
  },

  // ── 2027 Deadlines ───────────────────────────────────────────────────────
  {
    key: "productManager" as const,
    companyKey: "fintechLabs" as const,
    title: "Product Manager — Digital Lending",
    description:
      '<h3>About the Role</h3><p>We are seeking an experienced <strong>Product Manager</strong> to lead our lending product portfolio and drive innovation in digital financial services. You will define product vision, develop roadmaps, and manage the product lifecycle from ideation to launch.</p><h4>Key Responsibilities</h4><ul><li>Define product vision, strategy, and roadmaps</li><li>Conduct market research and competitive analysis</li><li>Write product requirements and user stories</li><li>Manage sprint planning and product backlog</li><li>Coordinate with engineering, design, and compliance teams</li><li>Analyze product metrics (NPS, retention, funnel conversion)</li></ul><h4>Required Qualifications</h4><ul><li><strong>5+ years</strong> of product management experience</li><li>Fintech or financial services background preferred</li><li>Strong analytical and problem-solving abilities</li><li>Agile/Scrum certification is a plus</li></ul>',
    category: "Product",
    employmentType: "Full-time",
    experienceLevel: "Senior",
    city: "Surabaya",
    province: "Jawa Timur",
    salaryMin: 28_000_000,
    salaryMax: 40_000_000,
    tags: ["product-management", "fintech", "agile", "scrum", "lending"],
    bannerUrl: "https://placehold.co/960x360/4ECDC4/ffffff?text=Product+Manager",
    applyDeadline: "2027-03-31",
    isPublished: true,
  },
  {
    key: "marketingSpecialist" as const,
    companyKey: "creativeStudio" as const,
    title: "Digital Marketing Specialist",
    description:
      '<h3>About the Role</h3><p>Join our marketing team as a <strong>Digital Marketing Specialist</strong> to develop and execute data-driven marketing strategies for our creative agency and client projects across multiple industries.</p><h4>Key Responsibilities</h4><ul><li>Plan and execute multi-channel digital marketing campaigns</li><li>Manage social media accounts and community engagement</li><li>Create and optimize Google Ads and Meta Ads campaigns</li><li>Develop content calendars and SEO strategies</li><li>Track KPIs and produce performance reports</li><li>Coordinate with designers for marketing assets</li></ul><h4>Required Skills</h4><ul><li><strong>2+ years</strong> digital marketing experience</li><li>Google Analytics and Google Ads certified</li><li>Experience with SEO/SEM, email marketing, and social media</li><li>Data-driven mindset with strong copywriting skills</li></ul>',
    category: "Marketing",
    employmentType: "Full-time",
    experienceLevel: "Mid",
    city: "Bandung",
    province: "Jawa Barat",
    salaryMin: 10_000_000,
    salaryMax: 16_000_000,
    tags: ["digital-marketing", "seo", "google-ads", "social-media", "content-marketing"],
    bannerUrl: "https://placehold.co/960x360/F7B731/ffffff?text=Digital+Marketing",
    applyDeadline: "2027-06-30",
    isPublished: true,
  },
  {
    key: "backendEngineer" as const,
    companyKey: "techCorp" as const,
    title: "Backend Engineer — Microservices",
    description:
      '<h3>About the Role</h3><p>We are seeking a skilled <strong>Backend Engineer</strong> to build robust, scalable microservices and APIs that power our enterprise client solutions. You will work with Node.js, TypeScript, PostgreSQL, and cloud infrastructure.</p><h4>Key Responsibilities</h4><ul><li>Design and develop RESTful APIs and GraphQL endpoints</li><li>Implement database schemas and optimize query performance</li><li>Build microservices with proper service communication patterns</li><li>Write comprehensive unit and integration tests</li><li>Implement authentication, authorization, and security best practices</li><li>Collaborate with frontend developers and DevOps team</li></ul><h4>Required Skills</h4><ul><li><strong>3+ years</strong> backend development experience</li><li>Proficiency in Node.js and TypeScript</li><li>PostgreSQL or similar relational databases</li><li>Docker and containerization experience</li><li>Familiarity with AWS, Azure, or GCP</li></ul>',
    category: "Engineering",
    employmentType: "Full-time",
    experienceLevel: "Mid",
    city: "Jakarta",
    province: "DKI Jakarta",
    salaryMin: 22_000_000,
    salaryMax: 30_000_000,
    tags: ["nodejs", "typescript", "postgresql", "microservices", "docker"],
    bannerUrl: "https://placehold.co/960x360/5F27CD/ffffff?text=Backend+Engineer",
    applyDeadline: "2027-09-15",
    isPublished: true,
  },

  // ── 2028 Deadlines ───────────────────────────────────────────────────────
  {
    key: "customerSuccess" as const,
    companyKey: "techCorp" as const,
    title: "Customer Success Lead",
    description:
      '<h3>About the Role</h3><p>We are looking for a <strong>Customer Success Lead</strong> to build and manage our customer success team, ensuring exceptional client satisfaction and long-term enterprise partnerships.</p><h4>Key Responsibilities</h4><ul><li>Develop customer success strategies and onboarding playbooks</li><li>Manage a team of customer success managers</li><li>Conduct regular business reviews with enterprise clients</li><li>Identify upsell, cross-sell, and expansion opportunities</li><li>Analyze customer health scores and satisfaction metrics</li><li>Collaborate with product teams on customer feedback loop</li></ul><h4>Required Qualifications</h4><ul><li><strong>5+ years</strong> of customer success or account management</li><li>Experience in B2B technology or SaaS</li><li>Strong leadership and team-building skills</li><li>CRM platform experience (Salesforce, HubSpot)</li></ul>',
    category: "Operations",
    employmentType: "Hybrid",
    experienceLevel: "Senior",
    city: "Jakarta",
    province: "DKI Jakarta",
    salaryMin: 18_000_000,
    salaryMax: 26_000_000,
    tags: ["customer-success", "saas", "leadership", "account-management", "crm"],
    bannerUrl: "https://placehold.co/960x360/1ABC9C/ffffff?text=Customer+Success+Lead",
    applyDeadline: "2028-02-28",
    isPublished: true,
  },
  {
    key: "devopsEngineer" as const,
    companyKey: "techCorp" as const,
    title: "DevOps Engineer",
    description:
      '<h3>About the Role</h3><p>Join our DevOps team as a <strong>DevOps Engineer</strong> to manage cloud infrastructure, implement CI/CD pipelines, and ensure high availability of our systems using AWS, Docker, and Kubernetes.</p><h4>Key Responsibilities</h4><ul><li>Design cloud infrastructure using Infrastructure as Code (Terraform)</li><li>Manage Kubernetes clusters and Docker containers</li><li>Build and maintain CI/CD pipelines (GitHub Actions, Jenkins)</li><li>Implement monitoring, logging, and alerting (Prometheus, Grafana)</li><li>Ensure security compliance and cost optimization</li><li>Collaborate with developers on performance and scaling</li></ul><h4>Required Skills</h4><ul><li><strong>4+ years</strong> DevOps or infrastructure experience</li><li>Strong AWS expertise (EC2, ECS, RDS, S3, Lambda)</li><li>Docker and Kubernetes proficiency</li><li>Terraform and IaC experience</li><li>Scripting with Python or Bash</li></ul>',
    category: "Engineering",
    employmentType: "Full-time",
    experienceLevel: "Senior",
    city: "Jakarta",
    province: "DKI Jakarta",
    salaryMin: 26_000_000,
    salaryMax: 36_000_000,
    tags: ["aws", "docker", "kubernetes", "terraform", "ci-cd"],
    bannerUrl: "https://placehold.co/960x360/E74C3C/ffffff?text=DevOps+Engineer",
    applyDeadline: "2028-06-30",
    isPublished: true,
  },
  {
    key: "uiDesigner" as const,
    companyKey: "creativeStudio" as const,
    title: "UI Designer",
    description:
      '<h3>About the Role</h3><p>We are looking for a talented <strong>UI Designer</strong> to create beautiful, functional interfaces for web and mobile applications. You will translate wireframes into pixel-perfect designs that delight users.</p><h4>Key Responsibilities</h4><ul><li>Create high-fidelity mockups and prototypes in Figma</li><li>Develop comprehensive design systems and component libraries</li><li>Design responsive layouts for web and mobile</li><li>Collaborate with developers for accurate implementation</li><li>Present design concepts to clients and stakeholders</li></ul><h4>Required Skills</h4><ul><li><strong>2-3 years</strong> UI design experience</li><li>Figma, Sketch, Adobe Creative Suite</li><li>Strong understanding of typography, color theory, and spacing</li><li>Responsive design and mobile-first approach</li><li>Portfolio showcasing clean, modern interface designs</li></ul>',
    category: "Design",
    employmentType: "Full-time",
    experienceLevel: "Mid",
    city: "Bandung",
    province: "Jawa Barat",
    salaryMin: 11_000_000,
    salaryMax: 17_000_000,
    tags: ["ui", "figma", "sketch", "design-systems", "responsive"],
    bannerUrl: "https://placehold.co/960x360/9B59B6/ffffff?text=UI+Designer",
    applyDeadline: "2028-09-30",
    isPublished: true,
  },

  // ── 2029 Deadlines ───────────────────────────────────────────────────────
  {
    key: "contentWriter" as const,
    companyKey: "creativeStudio" as const,
    title: "Content Writer & SEO Specialist",
    description:
      '<h3>About the Role</h3><p>Join our creative team as a <strong>Content Writer & SEO Specialist</strong> to craft compelling copy for marketing campaigns, brand communications, and digital content that drives organic growth.</p><h4>Key Responsibilities</h4><ul><li>Write engaging copy for websites, blogs, and social media</li><li>Develop content strategies and editorial calendars</li><li>Conduct keyword research and implement SEO best practices</li><li>Collaborate with designers on cohesive marketing campaigns</li><li>Optimize existing content for search visibility</li></ul><h4>Required Skills</h4><ul><li><strong>1-2 years</strong> content writing or copywriting</li><li>Excellent writing, editing, and proofreading skills</li><li>SEO tools experience (Ahrefs, SEMrush, Google Search Console)</li><li>Content management systems knowledge (WordPress, Ghost)</li></ul>',
    category: "Marketing",
    employmentType: "Part-time",
    experienceLevel: "Junior",
    city: "Bandung",
    province: "Jawa Barat",
    salaryMin: 6_000_000,
    salaryMax: 10_000_000,
    tags: ["copywriting", "seo", "content-strategy", "blogging", "wordpress"],
    bannerUrl: "https://placehold.co/960x360/F39C12/ffffff?text=Content+Writer",
    applyDeadline: "2029-03-31",
    isPublished: true,
  },
  {
    key: "qaEngineer" as const,
    companyKey: "fintechLabs" as const,
    title: "QA Engineer — Fintech",
    description:
      '<h3>About the Role</h3><p>We are seeking a detail-oriented <strong>QA Engineer</strong> to ensure the reliability, security, and performance of our fintech applications where accuracy and compliance are paramount.</p><h4>Key Responsibilities</h4><ul><li>Develop and execute test plans, cases, and scripts</li><li>Implement automated testing with Cypress & Playwright</li><li>Conduct security testing and vulnerability assessments</li><li>Perform API testing using Postman and Insomnia</li><li>Ensure compliance with financial regulations (OJK standards)</li><li>Collaborate with developers on defect resolution</li></ul><h4>Required Skills</h4><ul><li><strong>2-3 years</strong> QA testing experience</li><li>Automated testing tools (Cypress, Selenium, Playwright)</li><li>API testing and performance testing methodologies</li><li>Bug tracking systems (Jira, Linear)</li><li>Fintech or financial services experience preferred</li></ul>',
    category: "Engineering",
    employmentType: "Full-time",
    experienceLevel: "Mid",
    city: "Surabaya",
    province: "Jawa Timur",
    salaryMin: 15_000_000,
    salaryMax: 22_000_000,
    tags: ["testing", "automation", "cypress", "playwright", "qa"],
    bannerUrl: "https://placehold.co/960x360/2ECC71/ffffff?text=QA+Engineer",
    applyDeadline: "2029-06-30",
    isPublished: true,
  },
  {
    key: "businessAnalyst" as const,
    companyKey: "fintechLabs" as const,
    title: "Business Analyst — Financial Products",
    description:
      '<h3>About the Role</h3><p>We are seeking a <strong>Business Analyst</strong> to bridge business stakeholders and technical teams, ensuring successful delivery of fintech product features and improvements.</p><h4>Key Responsibilities</h4><ul><li>Gather and document business requirements</li><li>Translate business needs into technical specifications</li><li>Create process flow diagrams and data models</li><li>Facilitate stakeholder workshops and interviews</li><li>Validate solutions against business objectives</li><li>Support UAT and go-live activities</li></ul><h4>Required Skills</h4><ul><li>Strong analytical and problem-solving skills</li><li>Excellent documentation and communication</li><li>Requirements gathering and business process modeling</li><li>Jira, Confluence, or similar tools</li><li>Fintech or financial services experience preferred</li></ul>',
    category: "Business",
    employmentType: "Full-time",
    experienceLevel: "Mid",
    city: "Surabaya",
    province: "Jawa Timur",
    salaryMin: 16_000_000,
    salaryMax: 24_000_000,
    tags: ["business-analysis", "requirements", "fintech", "documentation", "agile"],
    bannerUrl: "https://placehold.co/960x360/3498DB/ffffff?text=Business+Analyst",
    applyDeadline: "2029-09-30",
    isPublished: true,
  },
  {
    key: "mobileDeveloper" as const,
    companyKey: "techCorp" as const,
    title: "Mobile Developer — React Native & Flutter",
    description:
      '<h3>About the Role</h3><p>We are seeking a <strong>Mobile Developer</strong> to create cross-platform mobile applications using React Native and Flutter for our enterprise clients.</p><h4>Key Responsibilities</h4><ul><li>Develop cross-platform mobile apps (React Native, Flutter)</li><li>Implement responsive and intuitive mobile UIs</li><li>Integrate with backend APIs and third-party SDKs</li><li>Optimize app performance and reduce bundle size</li><li>Publish and maintain apps on App Store and Google Play</li><li>Test across multiple devices and OS versions</li></ul><h4>Required Skills</h4><ul><li>React Native and Flutter proficiency</li><li>JavaScript, TypeScript, Dart</li><li>iOS and Android platform knowledge</li><li>RESTful API integration and state management</li><li>Mobile app testing methodologies</li></ul>',
    category: "Engineering",
    employmentType: "Full-time",
    experienceLevel: "Mid",
    city: "Jakarta",
    province: "DKI Jakarta",
    salaryMin: 20_000_000,
    salaryMax: 28_000_000,
    tags: ["react-native", "flutter", "mobile", "dart", "cross-platform"],
    bannerUrl: "https://placehold.co/960x360/8E44AD/ffffff?text=Mobile+Developer",
    applyDeadline: "2029-12-31",
    isPublished: true,
  },

  // ── Unpublished / Draft Jobs (no deadline) ─────────────────────────────
  {
    key: "hrSpecialist" as const,
    companyKey: "creativeStudio" as const,
    title: "HR & Talent Acquisition Specialist",
    description:
      '<h3>About the Role</h3><p>We are looking for an <strong>HR & Talent Acquisition Specialist</strong> to manage recruitment, employee relations, and organizational development for our growing creative team.</p><h4>Key Responsibilities</h4><ul><li>Manage end-to-end recruitment for design and marketing roles</li><li>Conduct interviews and candidate assessments</li><li>Develop onboarding and offboarding processes</li><li>Handle employee relations and conflict resolution</li><li>Organize training and team-building programs</li></ul><h4>Required Skills</h4><ul><li>Talent acquisition and sourcing experience</li><li>Strong knowledge of HR practices and labor laws</li><li>Excellent interpersonal and communication skills</li><li>HRIS platform experience (BambooHR, Workday)</li></ul>',
    category: "Human Resources",
    employmentType: "Full-time",
    experienceLevel: "Mid",
    city: "Bandung",
    province: "Jawa Barat",
    salaryMin: 12_000_000,
    salaryMax: 18_000_000,
    tags: ["recruitment", "hr", "employee-relations", "talent-acquisition", "onboarding"],
    bannerUrl: "https://placehold.co/960x360/E67E22/ffffff?text=HR+Specialist",
    applyDeadline: null as string | null,
    isPublished: false,
  },
] as const;

const testSeeds = [
  {
    key: "frontend" as const,
    jobKey: "frontend" as const,
    prefix: "Frontend",
    passingScore: 18,
    answer: "A",
  },
  {
    key: "dataScientist" as const,
    jobKey: "dataScientist" as const,
    prefix: "Data",
    passingScore: 17,
    answer: "B",
  },
  {
    key: "backendEngineer" as const,
    jobKey: "backendEngineer" as const,
    prefix: "Backend",
    passingScore: 17,
    answer: "A",
  },
  {
    key: "devopsEngineer" as const,
    jobKey: "devopsEngineer" as const,
    prefix: "DevOps",
    passingScore: 18,
    answer: "C",
  },
  {
    key: "mobileDeveloper" as const,
    jobKey: "mobileDeveloper" as const,
    prefix: "Mobile",
    passingScore: 16,
    answer: "D",
  },
] as const;

type CompanySeed = (typeof companySeeds)[number];
type CompanyKey = CompanySeed["key"];

type JobSeed = (typeof jobSeeds)[number];
type JobKey = JobSeed["key"];

type TestSeed = (typeof testSeeds)[number];
type TestKey = TestSeed["key"];

export type SeedCompaniesResult = {
  companies: Record<CompanyKey, Company>;
  jobs: Record<JobKey, Job>;
  tests: Record<TestKey, PreselectionTest>;
};

export async function seedCompaniesAndJobs({
  prisma,
  now,
  addDays,
  users,
}: SeedCompaniesOptions): Promise<SeedCompaniesResult> {
  const companyEntries = await Promise.all(
    companySeeds.map(async (seed) => {
      const company = await prisma.company.create({
        data: {
          ownerAdminId: seed.ownerKey ? users.admins[seed.ownerKey].id : null,
          name: seed.name,
          email: seed.email,
          phone: seed.phone,
          description: seed.description,
          logoUrl: seed.logoUrl,
          bannerUrl: seed.bannerUrl,
          website: seed.website,
          locationCity: seed.locationCity,
          locationProvince: seed.locationProvince,
          address: seed.address,
          socials: seed.socials,
        },
      });
      return [seed.key, company] as const;
    })
  );

  const companies = Object.fromEntries(companyEntries) as Record<CompanyKey, Company>;

  const jobEntries = await Promise.all(
    jobSeeds.map(async (seed) => {
      const applyDeadline = seed.applyDeadline ? new Date(seed.applyDeadline) : null;

      const job = await prisma.job.create({
        data: {
          companyId: companies[seed.companyKey].id,
          title: seed.title,
          description: seed.description,
          category: seed.category,
          employmentType: seed.employmentType,
          experienceLevel: seed.experienceLevel,
          city: seed.city,
          province: seed.province,
          salaryMin: seed.salaryMin,
          salaryMax: seed.salaryMax,
          tags: [...seed.tags],
          bannerUrl: seed.bannerUrl,
          applyDeadline,
          isPublished: seed.isPublished,
          publishedAt: seed.isPublished ? now : null,
        },
      });
      return [seed.key, job] as const;
    })
  );

  const jobs = Object.fromEntries(jobEntries) as Record<JobKey, Job>;

  const testEntries = await Promise.all(
    testSeeds.map(async (seed) => {
      const test = await prisma.preselectionTest.create({
        data: {
          jobId: jobs[seed.jobKey].id,
          passingScore: seed.passingScore,
          questions: { create: buildMCQ(seed.prefix, 25, seed.answer) },
        },
      });
      return [seed.key, test] as const;
    })
  );

  const tests = Object.fromEntries(testEntries) as Record<TestKey, PreselectionTest>;

  return { companies, jobs, tests };
}
