"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const prisma_1 = require("../generated/prisma");
const hashPassword_1 = require("../utils/hashPassword");
const prisma = new prisma_1.PrismaClient();
async function comprehensiveSeed() {
    console.log("🌱 Starting comprehensive database seed...");
    // Clear all data first
    console.log("🗑️  Clearing existing data...");
    await prisma.$transaction([
        prisma.applicantAnswer.deleteMany(),
        prisma.preselectionResult.deleteMany(),
        prisma.preselectionQuestion.deleteMany(),
        prisma.preselectionTest.deleteMany(),
        prisma.interview.deleteMany(),
        prisma.applicationTimeline.deleteMany(),
        prisma.applicationAttachment.deleteMany(),
        prisma.application.deleteMany(),
        prisma.savedJob.deleteMany(),
        prisma.job.deleteMany(),
        prisma.companyReview.deleteMany(),
        prisma.employment.deleteMany(),
        prisma.company.deleteMany(),
        prisma.certificate.deleteMany(),
        prisma.userBadge.deleteMany(),
        prisma.skillResult.deleteMany(),
        prisma.skillQuestion.deleteMany(),
        prisma.skillAssessment.deleteMany(),
        prisma.badgeTemplate.deleteMany(),
        prisma.badge.deleteMany(),
        prisma.generatedCV.deleteMany(),
        prisma.payment.deleteMany(),
        prisma.subscription.deleteMany(),
        prisma.subscriptionPlan.deleteMany(),
        prisma.jobShare.deleteMany(),
        prisma.analyticsEvent.deleteMany(),
        prisma.userProvider.deleteMany(),
        prisma.userProfile.deleteMany(),
        prisma.user.deleteMany(),
    ]);
    const now = new Date();
    const addDays = (days) => new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
    const addHours = (hours) => new Date(now.getTime() + hours * 60 * 60 * 1000);
    // Hash passwords
    const [adminPass, userPass, devPass] = await Promise.all([
        (0, hashPassword_1.hashPassword)("admin123"),
        (0, hashPassword_1.hashPassword)("user123"),
        (0, hashPassword_1.hashPassword)("dev123"),
    ]);
    console.log("👥 Creating users...");
    // Create Developer
    const developer = await prisma.user.create({
        data: {
            role: "DEVELOPER",
            email: "developer@workoo.com",
            passwordHash: devPass,
            name: "System Developer",
            emailVerifiedAt: now,
            isActive: true,
        },
    });
    // Create Admin Users (Company Owners)
    const adminTechCorp = await prisma.user.create({
        data: {
            role: "ADMIN",
            email: "admin@techcorp.id",
            passwordHash: adminPass,
            name: "TechCorp Admin",
            phone: "+6281234567890",
            emailVerifiedAt: now,
            isActive: true,
        },
    });
    const adminCreative = await prisma.user.create({
        data: {
            role: "ADMIN",
            email: "admin@creativestudio.id",
            passwordHash: adminPass,
            name: "Creative Studio Admin",
            phone: "+6281234567891",
            emailVerifiedAt: now,
            isActive: true,
        },
    });
    const adminFintech = await prisma.user.create({
        data: {
            role: "ADMIN",
            email: "admin@fintechlabs.id",
            passwordHash: adminPass,
            name: "Fintech Labs Admin",
            phone: "+6281234567892",
            emailVerifiedAt: now,
            isActive: true,
        },
    });
    // Create Regular Users (Job Seekers)
    const users = await Promise.all([
        prisma.user.create({
            data: {
                role: "USER",
                email: "alice.chen@gmail.com",
                passwordHash: userPass,
                name: "Alice Chen",
                phone: "+6281111111111",
                gender: "Female",
                dob: new Date("1995-06-15"),
                education: "S1 Computer Science - UI",
                address: "Jl. Margonda Raya No. 10",
                city: "Depok",
                profilePicture: "https://i.pravatar.cc/150?img=1",
                emailVerifiedAt: now,
                isActive: true,
            },
        }),
        prisma.user.create({
            data: {
                role: "USER",
                email: "bob.wijaya@gmail.com",
                passwordHash: userPass,
                name: "Bob Wijaya",
                phone: "+6281222222222",
                gender: "Male",
                dob: new Date("1993-03-22"),
                education: "S1 Statistika - ITB",
                address: "Jl. Ganesha No. 25",
                city: "Bandung",
                profilePicture: "https://i.pravatar.cc/150?img=12",
                emailVerifiedAt: now,
                isActive: true,
            },
        }),
        prisma.user.create({
            data: {
                role: "USER",
                email: "citra.devi@gmail.com",
                passwordHash: userPass,
                name: "Citra Devi",
                phone: "+6281333333333",
                gender: "Female",
                dob: new Date("1997-08-10"),
                education: "S1 Desain Komunikasi Visual - ITS",
                address: "Jl. Manyar No. 15",
                city: "Surabaya",
                profilePicture: "https://i.pravatar.cc/150?img=5",
                emailVerifiedAt: now,
                isActive: true,
            },
        }),
        prisma.user.create({
            data: {
                role: "USER",
                email: "dimas.pratama@gmail.com",
                passwordHash: userPass,
                name: "Dimas Pratama",
                phone: "+6281444444444",
                gender: "Male",
                dob: new Date("1992-12-05"),
                education: "S2 Business Administration - UGM",
                address: "Jl. Kaliurang KM 5",
                city: "Yogyakarta",
                profilePicture: "https://i.pravatar.cc/150?img=13",
                emailVerifiedAt: now,
                isActive: true,
            },
        }),
        prisma.user.create({
            data: {
                role: "USER",
                email: "endah.kusuma@gmail.com",
                passwordHash: userPass,
                name: "Endah Kusuma",
                phone: "+6281555555555",
                gender: "Female",
                dob: new Date("1996-04-18"),
                education: "S1 Marketing - Binus",
                address: "Jl. Kebon Jeruk Raya No. 88",
                city: "Jakarta",
                profilePicture: "https://i.pravatar.cc/150?img=9",
                emailVerifiedAt: now,
                isActive: true,
            },
        }),
        prisma.user.create({
            data: {
                role: "USER",
                email: "fajar.santoso@gmail.com",
                passwordHash: userPass,
                name: "Fajar Santoso",
                phone: "+6281666666666",
                gender: "Male",
                dob: new Date("1994-11-30"),
                education: "S1 Teknik Informatika - Unpad",
                address: "Jl. Dipatiukur No. 50",
                city: "Bandung",
                profilePicture: "https://i.pravatar.cc/150?img=14",
                emailVerifiedAt: now,
                isActive: true,
            },
        }),
    ]);
    const [alice, bob, citra, dimas, endah, fajar] = users;
    console.log("🏢 Creating companies...");
    // Create Companies
    const techCorp = await prisma.company.create({
        data: {
            ownerAdminId: adminTechCorp.id,
            name: "TechCorp Indonesia",
            email: "contact@techcorp.id",
            phone: "+622112345678",
            description: "<p>TechCorp Indonesia adalah perusahaan teknologi terkemuka yang berfokus pada solusi cloud-native dan transformasi digital untuk enterprise. Kami memiliki lebih dari 200+ klien di seluruh Indonesia dan terus berkembang.</p><p>Bergabunglah dengan tim kami dan wujudkan karir di dunia teknologi!</p>",
            logoUrl: "https://ui-avatars.com/api/?name=TechCorp&size=200&background=24CFA7&color=fff",
            bannerUrl: "https://placehold.co/1200x400/467EC7/ffffff?text=TechCorp+Indonesia",
            website: "https://techcorp.id",
            locationCity: "Jakarta",
            locationProvince: "DKI Jakarta",
            locationCountry: "ID",
            address: "Jl. Gatot Subroto Kav. 52-53, Jakarta Selatan",
            socials: {
                linkedin: "https://linkedin.com/company/techcorp-id",
                instagram: "https://instagram.com/techcorp.id",
                twitter: "https://twitter.com/techcorp_id"
            },
        },
    });
    const creativeStudio = await prisma.company.create({
        data: {
            ownerAdminId: adminCreative.id,
            name: "Creative Studio Bandung",
            email: "hello@creativestudio.id",
            phone: "+622276543210",
            description: "<p>Creative Studio adalah design agency terpercaya yang menghasilkan pengalaman digital yang memorable. Kami spesialis dalam UI/UX design, branding, dan digital marketing.</p><p>Klien kami termasuk startup unicorn dan brand multinasional.</p>",
            logoUrl: "https://ui-avatars.com/api/?name=Creative+Studio&size=200&background=467EC7&color=fff",
            bannerUrl: "https://placehold.co/1200x400/24CFA7/ffffff?text=Creative+Studio",
            website: "https://creativestudio.id",
            locationCity: "Bandung",
            locationProvince: "Jawa Barat",
            locationCountry: "ID",
            address: "Jl. Riau No. 5-7, Bandung",
            socials: {
                instagram: "https://instagram.com/creativestudio.bdg",
                dribbble: "https://dribbble.com/creativestudio",
                behance: "https://behance.net/creativestudio"
            },
        },
    });
    const fintechLabs = await prisma.company.create({
        data: {
            ownerAdminId: adminFintech.id,
            name: "Fintech Labs Indonesia",
            email: "info@fintechlabs.id",
            phone: "+623187654321",
            description: "<p>Fintech Labs adalah platform financial services yang menyediakan solusi pembayaran digital dan lending untuk UMKM di Indonesia. Kami telah melayani lebih dari 50,000+ merchant.</p><p>Misi kami adalah financial inclusion untuk seluruh Indonesia.</p>",
            logoUrl: "https://ui-avatars.com/api/?name=Fintech+Labs&size=200&background=FF6B6B&color=fff",
            bannerUrl: "https://placehold.co/1200x400/FF6B6B/ffffff?text=Fintech+Labs",
            website: "https://fintechlabs.id",
            locationCity: "Surabaya",
            locationProvince: "Jawa Timur",
            locationCountry: "ID",
            address: "Jl. Tunjungan No. 20-22, Surabaya",
            socials: {
                linkedin: "https://linkedin.com/company/fintechlabs-id",
                twitter: "https://twitter.com/fintechlabs"
            },
        },
    });
    console.log("💼 Creating job postings...");
    // Create Jobs
    const jobFrontend = await prisma.job.create({
        data: {
            companyId: techCorp.id,
            title: "Senior Frontend Engineer",
            description: `<h3>About the Role</h3>
<p>We are looking for an experienced Frontend Engineer to lead our web development team. You will be responsible for building scalable, performant web applications using React and TypeScript.</p>

<h3>Responsibilities</h3>
<ul>
<li>Lead frontend architecture decisions</li>
<li>Mentor junior developers</li>
<li>Build reusable component libraries</li>
<li>Optimize application performance</li>
<li>Collaborate with designers and backend team</li>
</ul>

<h3>Requirements</h3>
<ul>
<li>5+ years experience with React</li>
<li>Strong TypeScript skills</li>
<li>Experience with state management (Redux/Zustand)</li>
<li>Understanding of web performance optimization</li>
<li>Bachelor's degree in Computer Science or related field</li>
</ul>`,
            category: "Engineering",
            employmentType: "Full-time",
            experienceLevel: "Senior",
            city: "Jakarta",
            province: "DKI Jakarta",
            salaryMin: 25000000,
            salaryMax: 35000000,
            salaryCurrency: "IDR",
            tags: ["react", "typescript", "javascript", "frontend", "ui"],
            bannerUrl: "https://placehold.co/960x360/24CFA7/ffffff?text=Frontend+Engineer",
            applyDeadline: addDays(30),
            isPublished: true,
            publishedAt: now,
        },
    });
    const jobData = await prisma.job.create({
        data: {
            companyId: techCorp.id,
            title: "Data Scientist",
            description: `<h3>About the Role</h3>
<p>Join our data team to build predictive models and analytics solutions that drive business decisions.</p>

<h3>Responsibilities</h3>
<ul>
<li>Develop machine learning models</li>
<li>Analyze large datasets</li>
<li>Create data visualizations</li>
<li>Collaborate with product teams</li>
</ul>

<h3>Requirements</h3>
<ul>
<li>3+ years in data science</li>
<li>Python, SQL, and statistical modeling</li>
<li>Experience with ML frameworks (TensorFlow, PyTorch)</li>
<li>Strong communication skills</li>
</ul>`,
            category: "Data",
            employmentType: "Full-time",
            experienceLevel: "Mid",
            city: "Jakarta",
            province: "DKI Jakarta",
            salaryMin: 20000000,
            salaryMax: 28000000,
            tags: ["python", "machine-learning", "sql", "data"],
            bannerUrl: "https://placehold.co/960x360/467EC7/ffffff?text=Data+Scientist",
            applyDeadline: addDays(25),
            isPublished: true,
            publishedAt: now,
        },
    });
    const jobUX = await prisma.job.create({
        data: {
            companyId: creativeStudio.id,
            title: "UX Designer",
            description: `<h3>About the Role</h3>
<p>Create beautiful, intuitive user experiences for our diverse client portfolio.</p>

<h3>What You'll Do</h3>
<ul>
<li>Conduct user research and usability testing</li>
<li>Create wireframes and prototypes</li>
<li>Design user flows and information architecture</li>
<li>Collaborate with UI designers and developers</li>
</ul>

<h3>Requirements</h3>
<ul>
<li>2+ years UX design experience</li>
<li>Proficient in Figma and design tools</li>
<li>Portfolio showcasing UX work</li>
<li>Understanding of design thinking</li>
</ul>`,
            category: "Design",
            employmentType: "Contract",
            experienceLevel: "Mid",
            city: "Bandung",
            province: "Jawa Barat",
            salaryMin: 12000000,
            salaryMax: 18000000,
            tags: ["ux", "figma", "research", "design"],
            bannerUrl: "https://placehold.co/960x360/FF6B6B/ffffff?text=UX+Designer",
            applyDeadline: addDays(20),
            isPublished: true,
            publishedAt: now,
        },
    });
    const jobProduct = await prisma.job.create({
        data: {
            companyId: fintechLabs.id,
            title: "Product Manager - Lending",
            description: `<h3>About the Role</h3>
<p>Own the lending product roadmap and drive innovation in digital finance.</p>

<h3>Key Responsibilities</h3>
<ul>
<li>Define product vision and strategy</li>
<li>Manage product backlog and roadmap</li>
<li>Work with engineering, design, and business teams</li>
<li>Analyze metrics and user feedback</li>
</ul>

<h3>Requirements</h3>
<ul>
<li>5+ years product management experience</li>
<li>Fintech or lending experience preferred</li>
<li>Strong analytical skills</li>
<li>Excellent stakeholder management</li>
</ul>`,
            category: "Product",
            employmentType: "Full-time",
            experienceLevel: "Senior",
            city: "Surabaya",
            province: "Jawa Timur",
            salaryMin: 28000000,
            salaryMax: 40000000,
            tags: ["product-management", "fintech", "agile"],
            bannerUrl: "https://placehold.co/960x360/4ECDC4/ffffff?text=Product+Manager",
            applyDeadline: addDays(35),
            isPublished: true,
            publishedAt: now,
        },
    });
    const jobMarketing = await prisma.job.create({
        data: {
            companyId: creativeStudio.id,
            title: "Digital Marketing Specialist",
            description: `<h3>Join Our Marketing Team</h3>
<p>Plan and execute digital marketing campaigns for premium brands.</p>

<h3>Responsibilities</h3>
<ul>
<li>Manage social media channels</li>
<li>Create content marketing strategies</li>
<li>Run paid advertising campaigns</li>
<li>Track and optimize campaign performance</li>
</ul>

<h3>Requirements</h3>
<ul>
<li>2+ years digital marketing experience</li>
<li>Google Analytics and Ads certified</li>
<li>Creative content creator</li>
<li>Data-driven mindset</li>
</ul>`,
            category: "Marketing",
            employmentType: "Full-time",
            experienceLevel: "Mid",
            city: "Bandung",
            province: "Jawa Barat",
            salaryMin: 10000000,
            salaryMax: 16000000,
            tags: ["digital-marketing", "seo", "social-media"],
            bannerUrl: "https://placehold.co/960x360/F7B731/ffffff?text=Marketing",
            applyDeadline: addDays(15),
            isPublished: true,
            publishedAt: now,
        },
    });
    const jobBackend = await prisma.job.create({
        data: {
            companyId: fintechLabs.id,
            title: "Backend Engineer - Payment Systems",
            description: `<h3>About the Role</h3>
<p>Build robust, scalable payment infrastructure serving millions of transactions.</p>

<h3>What You'll Build</h3>
<ul>
<li>Payment processing APIs</li>
<li>Transaction reconciliation systems</li>
<li>Integration with banking partners</li>
<li>High-availability microservices</li>
</ul>

<h3>Requirements</h3>
<ul>
<li>4+ years backend development</li>
<li>Experience with Node.js or Go</li>
<li>Understanding of payment systems</li>
<li>Database optimization skills</li>
</ul>`,
            category: "Engineering",
            employmentType: "Full-time",
            experienceLevel: "Senior",
            city: "Surabaya",
            province: "Jawa Timur",
            salaryMin: 22000000,
            salaryMax: 32000000,
            tags: ["nodejs", "postgresql", "microservices", "payment"],
            bannerUrl: "https://placehold.co/960x360/5F27CD/ffffff?text=Backend+Engineer",
            applyDeadline: addDays(28),
            isPublished: true,
            publishedAt: now,
        },
    });
    console.log("📝 Creating pre-selection tests (25 questions each)...");
    // Create Pre-selection Test for Frontend Job (25 MCQs)
    const testFrontend = await prisma.preselectionTest.create({
        data: {
            jobId: jobFrontend.id,
            isActive: true,
            passingScore: 18,
            questionCount: 25,
            timeLimitMinutes: 30,
            questions: {
                create: [
                    { question: "What is React?", options: ["A JavaScript library for building UIs", "A database", "A CSS framework", "A backend framework"], answer: "A JavaScript library for building UIs", orderIndex: 1 },
                    { question: "Which hook is used for side effects in React?", options: ["useState", "useEffect", "useContext", "useReducer"], answer: "useEffect", orderIndex: 2 },
                    { question: "What does JSX stand for?", options: ["JavaScript XML", "Java Syntax Extension", "JSON XML", "JavaScript Extension"], answer: "JavaScript XML", orderIndex: 3 },
                    { question: "How do you create a functional component in React?", options: ["function MyComponent() {}", "class MyComponent {}", "component MyComponent {}", "react MyComponent {}"], answer: "function MyComponent() {}", orderIndex: 4 },
                    { question: "What is the Virtual DOM?", options: ["A lightweight copy of the real DOM", "A database", "A server", "A CSS preprocessor"], answer: "A lightweight copy of the real DOM", orderIndex: 5 },
                    { question: "Which company created React?", options: ["Google", "Facebook/Meta", "Microsoft", "Amazon"], answer: "Facebook/Meta", orderIndex: 6 },
                    { question: "What is props in React?", options: ["Properties passed to components", "A state management tool", "A routing library", "A CSS framework"], answer: "Properties passed to components", orderIndex: 7 },
                    { question: "How do you manage state in React?", options: ["useState hook", "localStorage", "sessionStorage", "cookies"], answer: "useState hook", orderIndex: 8 },
                    { question: "What is the purpose of keys in React lists?", options: ["Help React identify which items changed", "Style the list", "Sort the list", "Filter the list"], answer: "Help React identify which items changed", orderIndex: 9 },
                    { question: "What is TypeScript?", options: ["JavaScript with static types", "A database query language", "A CSS preprocessor", "A testing framework"], answer: "JavaScript with static types", orderIndex: 10 },
                    { question: "How do you handle forms in React?", options: ["Controlled components", "Uncontrolled components", "Both A and B", "None of the above"], answer: "Both A and B", orderIndex: 11 },
                    { question: "What is Redux used for?", options: ["State management", "Routing", "Styling", "Testing"], answer: "State management", orderIndex: 12 },
                    { question: "What is a Higher-Order Component (HOC)?", options: ["A function that takes a component and returns a new component", "A class component", "A styling method", "A testing utility"], answer: "A function that takes a component and returns a new component", orderIndex: 13 },
                    { question: "What is React Router used for?", options: ["Client-side routing", "Server-side rendering", "State management", "API calls"], answer: "Client-side routing", orderIndex: 14 },
                    { question: "What is the purpose of useContext?", options: ["Share data across components without props drilling", "Manage side effects", "Handle state", "Route navigation"], answer: "Share data across components without props drilling", orderIndex: 15 },
                    { question: "What is lazy loading in React?", options: ["Loading components on demand", "Slow loading", "Loading images", "Loading CSS"], answer: "Loading components on demand", orderIndex: 16 },
                    { question: "What is React.memo()?", options: ["Performance optimization for components", "Memory management", "State management", "Event handling"], answer: "Performance optimization for components", orderIndex: 17 },
                    { question: "What is the difference between props and state?", options: ["Props are immutable, state is mutable", "Props are mutable, state is immutable", "They are the same", "Props is newer"], answer: "Props are immutable, state is mutable", orderIndex: 18 },
                    { question: "What is useCallback used for?", options: ["Memoize callback functions", "API calls", "State updates", "Routing"], answer: "Memoize callback functions", orderIndex: 19 },
                    { question: "What is useMemo used for?", options: ["Memoize computed values", "API calls", "Event handling", "Routing"], answer: "Memoize computed values", orderIndex: 20 },
                    { question: "What is CSS-in-JS?", options: ["Writing CSS in JavaScript files", "A CSS preprocessor", "A JavaScript framework", "A database"], answer: "Writing CSS in JavaScript files", orderIndex: 21 },
                    { question: "What is Tailwind CSS?", options: ["Utility-first CSS framework", "JavaScript library", "Database", "Backend framework"], answer: "Utility-first CSS framework", orderIndex: 22 },
                    { question: "What is Server-Side Rendering (SSR)?", options: ["Rendering pages on the server", "Rendering on client only", "A database technique", "A testing method"], answer: "Rendering pages on the server", orderIndex: 23 },
                    { question: "What is Next.js?", options: ["React framework for production", "A database", "A CSS framework", "A state management library"], answer: "React framework for production", orderIndex: 24 },
                    { question: "What is the purpose of package.json?", options: ["Manage project dependencies", "Store user data", "Configure database", "Handle routing"], answer: "Manage project dependencies", orderIndex: 25 },
                ],
            },
        },
    });
    // Create Pre-selection Test for Data Scientist Job
    const testData = await prisma.preselectionTest.create({
        data: {
            jobId: jobData.id,
            isActive: true,
            passingScore: 17,
            questionCount: 25,
            timeLimitMinutes: 30,
            questions: {
                create: [
                    { question: "What is Python primarily used for?", options: ["Data science and web development", "Only games", "Only mobile apps", "Hardware programming"], answer: "Data science and web development", orderIndex: 1 },
                    { question: "What does SQL stand for?", options: ["Structured Query Language", "Simple Query Language", "Standard Query Language", "System Query Language"], answer: "Structured Query Language", orderIndex: 2 },
                    { question: "What is a DataFrame in pandas?", options: ["2D labeled data structure", "A 1D array", "A database", "A file format"], answer: "2D labeled data structure", orderIndex: 3 },
                    { question: "What is machine learning?", options: ["Algorithms that learn from data", "A programming language", "A database", "A web framework"], answer: "Algorithms that learn from data", orderIndex: 4 },
                    { question: "What is supervised learning?", options: ["Learning with labeled data", "Learning without labels", "Unsupervised clustering", "Reinforcement learning"], answer: "Learning with labeled data", orderIndex: 5 },
                    { question: "What is numpy used for?", options: ["Numerical computing", "Web development", "Database management", "Mobile apps"], answer: "Numerical computing", orderIndex: 6 },
                    { question: "What is the purpose of train-test split?", options: ["Evaluate model performance", "Clean data", "Visualize data", "Store data"], answer: "Evaluate model performance", orderIndex: 7 },
                    { question: "What is overfitting?", options: ["Model performs well on training but poor on test data", "Model performs poorly on all data", "Model is too simple", "Perfect model"], answer: "Model performs well on training but poor on test data", orderIndex: 8 },
                    { question: "What is a neural network?", options: ["Computing system inspired by biological neural networks", "A database structure", "A web server", "A file system"], answer: "Computing system inspired by biological neural networks", orderIndex: 9 },
                    { question: "What is regression analysis?", options: ["Predicting continuous values", "Classification task", "Clustering method", "Data cleaning"], answer: "Predicting continuous values", orderIndex: 10 },
                    { question: "What is classification in ML?", options: ["Categorizing data into classes", "Predicting numbers", "Data cleaning", "Data storage"], answer: "Categorizing data into classes", orderIndex: 11 },
                    { question: "What is cross-validation?", options: ["Technique to assess model performance", "Data cleaning method", "Visualization technique", "Database operation"], answer: "Technique to assess model performance", orderIndex: 12 },
                    { question: "What is feature engineering?", options: ["Creating new features from raw data", "Deleting features", "Storing features", "Testing features"], answer: "Creating new features from raw data", orderIndex: 13 },
                    { question: "What is regularization?", options: ["Technique to prevent overfitting", "Data cleaning", "Feature selection only", "Database indexing"], answer: "Technique to prevent overfitting", orderIndex: 14 },
                    { question: "What is a confusion matrix?", options: ["Table to evaluate classification model", "Data cleaning tool", "Visualization library", "Database schema"], answer: "Table to evaluate classification model", orderIndex: 15 },
                    { question: "What is precision in ML?", options: ["Ratio of true positives to predicted positives", "Model speed", "Data quality", "Memory usage"], answer: "Ratio of true positives to predicted positives", orderIndex: 16 },
                    { question: "What is recall in ML?", options: ["Ratio of true positives to actual positives", "Model accuracy", "Processing time", "Storage size"], answer: "Ratio of true positives to actual positives", orderIndex: 17 },
                    { question: "What is K-means clustering?", options: ["Unsupervised clustering algorithm", "Supervised learning", "Deep learning", "Data cleaning"], answer: "Unsupervised clustering algorithm", orderIndex: 18 },
                    { question: "What is TensorFlow?", options: ["Machine learning framework", "Database", "Web framework", "CSS library"], answer: "Machine learning framework", orderIndex: 19 },
                    { question: "What is data normalization?", options: ["Scaling features to a standard range", "Deleting outliers", "Adding features", "Storing data"], answer: "Scaling features to a standard range", orderIndex: 20 },
                    { question: "What is a decision tree?", options: ["Tree-like model for decisions", "Database structure", "File system", "Network topology"], answer: "Tree-like model for decisions", orderIndex: 21 },
                    { question: "What is ensemble learning?", options: ["Combining multiple models", "Single model approach", "Data cleaning", "Feature selection"], answer: "Combining multiple models", orderIndex: 22 },
                    { question: "What is gradient descent?", options: ["Optimization algorithm", "Data structure", "Database query", "File format"], answer: "Optimization algorithm", orderIndex: 23 },
                    { question: "What is a ROC curve?", options: ["Plot showing classifier performance", "Data distribution", "Loss function", "Activation function"], answer: "Plot showing classifier performance", orderIndex: 24 },
                    { question: "What is exploratory data analysis (EDA)?", options: ["Initial data investigation to find patterns", "Final model deployment", "Data storage", "API development"], answer: "Initial data investigation to find patterns", orderIndex: 25 },
                ],
            },
        },
    });
    console.log("📋 Creating applications with test results...");
    // Alice applies to Frontend job and PASSES the test
    const appAlice = await prisma.application.create({
        data: {
            userId: alice.id,
            jobId: jobFrontend.id,
            cvUrl: "https://res.cloudinary.com/demo/cv/alice-chen-frontend.pdf",
            cvFileName: "alice-chen-cv.pdf",
            cvFileSize: 245000,
            expectedSalary: 30000000,
            expectedSalaryCurrency: "IDR",
            status: prisma_1.ApplicationStatus.INTERVIEW,
            reviewNote: "Excellent React portfolio, moving to technical interview",
            reviewUpdatedAt: now,
            referralSource: "LinkedIn",
            timeline: {
                create: [
                    { status: prisma_1.ApplicationStatus.SUBMITTED, note: "Application submitted", createdAt: addDays(-5), createdById: alice.id },
                    { status: prisma_1.ApplicationStatus.IN_REVIEW, note: "CV under review", createdAt: addDays(-3), createdById: adminTechCorp.id },
                    { status: prisma_1.ApplicationStatus.INTERVIEW, note: "Interview scheduled", createdAt: addDays(-1), createdById: adminTechCorp.id },
                ],
            },
        },
    });
    // Alice's test result - PASSED
    const resultAlice = await prisma.preselectionResult.create({
        data: {
            userId: alice.id,
            testId: testFrontend.id,
            score: 22,
            passed: true,
        },
    });
    // Record Alice's answers
    const frontendQuestions = await prisma.preselectionQuestion.findMany({
        where: { testId: testFrontend.id },
        orderBy: { orderIndex: 'asc' },
    });
    for (let i = 0; i < frontendQuestions.length; i++) {
        const q = frontendQuestions[i];
        if (!q)
            continue;
        const isCorrect = i < 22; // First 22 correct, last 3 wrong
        const options = q.options;
        const selected = isCorrect ? q.answer : (options[1] || options[0] || "");
        await prisma.applicantAnswer.create({
            data: {
                resultId: resultAlice.id,
                questionId: q.id,
                selected,
                isCorrect,
            },
        });
    }
    // Schedule interview for Alice
    await prisma.interview.create({
        data: {
            applicationId: appAlice.id,
            startsAt: addDays(5),
            endsAt: addHours(5 * 24 + 1),
            locationOrLink: "Google Meet: https://meet.google.com/abc-defg-hij",
            status: prisma_1.InterviewStatus.SCHEDULED,
            notes: "Technical interview: React, TypeScript, and system design",
            createdById: adminTechCorp.id,
            reminderSentAt: null,
        },
    });
    // Bob applies to Data Scientist and FAILS the test
    const appBob = await prisma.application.create({
        data: {
            userId: bob.id,
            jobId: jobData.id,
            cvUrl: "https://res.cloudinary.com/demo/cv/bob-wijaya-data.pdf",
            cvFileName: "bob-wijaya-cv.pdf",
            cvFileSize: 198000,
            expectedSalary: 24000000,
            expectedSalaryCurrency: "IDR",
            status: prisma_1.ApplicationStatus.SUBMITTED,
            referralSource: "Job Portal",
            timeline: {
                create: [
                    { status: prisma_1.ApplicationStatus.SUBMITTED, note: "Application submitted", createdAt: addDays(-2), createdById: bob.id },
                ],
            },
        },
    });
    // Bob's test result - FAILED (score 14 < passing 17)
    const resultBob = await prisma.preselectionResult.create({
        data: {
            userId: bob.id,
            testId: testData.id,
            score: 14,
            passed: false,
        },
    });
    const dataQuestions = await prisma.preselectionQuestion.findMany({
        where: { testId: testData.id },
        orderBy: { orderIndex: 'asc' },
    });
    for (let i = 0; i < dataQuestions.length; i++) {
        const q = dataQuestions[i];
        if (!q)
            continue;
        const isCorrect = i < 14;
        const options = q.options;
        const selected = isCorrect ? q.answer : (options[2] || options[0] || "");
        await prisma.applicantAnswer.create({
            data: {
                resultId: resultBob.id,
                questionId: q.id,
                selected,
                isCorrect,
            },
        });
    }
    // Citra applies to UX Designer (no pre-selection test for this job)
    const appCitra = await prisma.application.create({
        data: {
            userId: citra.id,
            jobId: jobUX.id,
            cvUrl: "https://res.cloudinary.com/demo/cv/citra-devi-ux.pdf",
            cvFileName: "citra-devi-cv.pdf",
            cvFileSize: 312000,
            expectedSalary: 15000000,
            expectedSalaryCurrency: "IDR",
            status: prisma_1.ApplicationStatus.ACCEPTED,
            reviewNote: "Outstanding portfolio, offer accepted",
            reviewUpdatedAt: now,
            timeline: {
                create: [
                    { status: prisma_1.ApplicationStatus.SUBMITTED, note: "Application with portfolio", createdAt: addDays(-10), createdById: citra.id },
                    { status: prisma_1.ApplicationStatus.IN_REVIEW, note: "Design challenge assigned", createdAt: addDays(-7), createdById: adminCreative.id },
                    { status: prisma_1.ApplicationStatus.INTERVIEW, note: "Panel interview completed", createdAt: addDays(-3), createdById: adminCreative.id },
                    { status: prisma_1.ApplicationStatus.ACCEPTED, note: "Offer letter signed", createdAt: addDays(-1), createdById: adminCreative.id },
                ],
            },
        },
    });
    await prisma.interview.create({
        data: {
            applicationId: appCitra.id,
            startsAt: addDays(-3),
            endsAt: addHours(-3 * 24 + 1.5),
            locationOrLink: "Onsite - Creative Studio Office, Bandung",
            status: prisma_1.InterviewStatus.COMPLETED,
            notes: "Design critique and portfolio review session",
            createdById: adminCreative.id,
            updatedById: adminCreative.id,
        },
    });
    // Dimas applies to Product Manager
    const appDimas = await prisma.application.create({
        data: {
            userId: dimas.id,
            jobId: jobProduct.id,
            cvUrl: "https://res.cloudinary.com/demo/cv/dimas-pratama-pm.pdf",
            cvFileName: "dimas-pratama-cv.pdf",
            cvFileSize: 267000,
            expectedSalary: 32000000,
            expectedSalaryCurrency: "IDR",
            status: prisma_1.ApplicationStatus.REJECTED,
            reviewNote: "Looking for more fintech industry experience",
            reviewUpdatedAt: now,
            timeline: {
                create: [
                    { status: prisma_1.ApplicationStatus.SUBMITTED, note: "Application received", createdAt: addDays(-8), createdById: dimas.id },
                    { status: prisma_1.ApplicationStatus.IN_REVIEW, note: "Screening call completed", createdAt: addDays(-6), createdById: adminFintech.id },
                    { status: prisma_1.ApplicationStatus.REJECTED, note: "Not aligned with current needs", createdAt: addDays(-4), createdById: adminFintech.id },
                ],
            },
        },
    });
    // Endah applies to Marketing
    const appEndah = await prisma.application.create({
        data: {
            userId: endah.id,
            jobId: jobMarketing.id,
            cvUrl: "https://res.cloudinary.com/demo/cv/endah-kusuma-marketing.pdf",
            cvFileName: "endah-kusuma-cv.pdf",
            cvFileSize: 223000,
            expectedSalary: 13000000,
            expectedSalaryCurrency: "IDR",
            status: prisma_1.ApplicationStatus.IN_REVIEW,
            referralSource: "Instagram",
            timeline: {
                create: [
                    { status: prisma_1.ApplicationStatus.SUBMITTED, note: "Application with campaign samples", createdAt: addDays(-1), createdById: endah.id },
                    { status: prisma_1.ApplicationStatus.IN_REVIEW, note: "Reviewing campaign portfolio", createdAt: now, createdById: adminCreative.id },
                ],
            },
        },
    });
    // Fajar applies to Backend Engineer and PASSES test
    const appFajar = await prisma.application.create({
        data: {
            userId: fajar.id,
            jobId: jobBackend.id,
            cvUrl: "https://res.cloudinary.com/demo/cv/fajar-santoso-backend.pdf",
            cvFileName: "fajar-santoso-cv.pdf",
            cvFileSize: 189000,
            expectedSalary: 26000000,
            expectedSalaryCurrency: "IDR",
            status: prisma_1.ApplicationStatus.INTERVIEW,
            reviewNote: "Strong backend experience, technical interview scheduled",
            reviewUpdatedAt: now,
            timeline: {
                create: [
                    { status: prisma_1.ApplicationStatus.SUBMITTED, note: "Application submitted", createdAt: addDays(-4), createdById: fajar.id },
                    { status: prisma_1.ApplicationStatus.IN_REVIEW, note: "Technical screening", createdAt: addDays(-2), createdById: adminFintech.id },
                    { status: prisma_1.ApplicationStatus.INTERVIEW, note: "Moving to onsite interview", createdAt: now, createdById: adminFintech.id },
                ],
            },
        },
    });
    await prisma.interview.create({
        data: {
            applicationId: appFajar.id,
            startsAt: addDays(7),
            endsAt: addHours(7 * 24 + 2),
            locationOrLink: "Onsite - Fintech Labs Office, Surabaya",
            status: prisma_1.InterviewStatus.SCHEDULED,
            notes: "System design and coding interview",
            createdById: adminFintech.id,
        },
    });
    console.log("✅ Seed completed successfully!");
    console.log("\n" + "=".repeat(60));
    console.log("📧 ACCOUNT CREDENTIALS");
    console.log("=".repeat(60));
    console.log("\n🔐 ADMIN ACCOUNTS (Company Owners):");
    console.log("─".repeat(60));
    console.log("1. TechCorp Indonesia");
    console.log("   Email    : admin@techcorp.id");
    console.log("   Password : admin123");
    console.log("   Company  : TechCorp Indonesia (Jakarta)");
    console.log("   Jobs     : 2 active jobs (Frontend Engineer, Data Scientist)");
    console.log("   Tests    : 2 pre-selection tests (25 questions each)");
    console.log("   Applicants: 2 applicants with test results");
    console.log("");
    console.log("2. Creative Studio Bandung");
    console.log("   Email    : admin@creativestudio.id");
    console.log("   Password : admin123");
    console.log("   Company  : Creative Studio Bandung");
    console.log("   Jobs     : 2 jobs (UX Designer, Marketing Specialist)");
    console.log("");
    console.log("3. Fintech Labs Indonesia");
    console.log("   Email    : admin@fintechlabs.id");
    console.log("   Password : admin123");
    console.log("   Company  : Fintech Labs Indonesia (Surabaya)");
    console.log("   Jobs     : 2 jobs (Product Manager, Backend Engineer)");
    console.log("");
    console.log("─".repeat(60));
    console.log("\n👤 USER ACCOUNTS (Job Seekers):");
    console.log("─".repeat(60));
    console.log("1. Alice Chen (APPLIED & PASSED TEST)");
    console.log("   Email    : alice.chen@gmail.com");
    console.log("   Password : user123");
    console.log("   Applied  : Senior Frontend Engineer @ TechCorp");
    console.log("   Test     : 22/25 ✓ PASSED");
    console.log("   Status   : INTERVIEW (scheduled in 5 days)");
    console.log("");
    console.log("2. Bob Wijaya (FAILED TEST)");
    console.log("   Email    : bob.wijaya@gmail.com");
    console.log("   Password : user123");
    console.log("   Applied  : Data Scientist @ TechCorp");
    console.log("   Test     : 14/25 ✗ FAILED (passing: 17)");
    console.log("   Status   : SUBMITTED (blocked due to failed test)");
    console.log("");
    console.log("3. Citra Devi (ACCEPTED)");
    console.log("   Email    : citra.devi@gmail.com");
    console.log("   Password : user123");
    console.log("   Applied  : UX Designer @ Creative Studio");
    console.log("   Status   : ACCEPTED (offer signed)");
    console.log("");
    console.log("4. Dimas Pratama (REJECTED)");
    console.log("   Email    : dimas.pratama@gmail.com");
    console.log("   Password : user123");
    console.log("   Applied  : Product Manager @ Fintech Labs");
    console.log("   Status   : REJECTED");
    console.log("");
    console.log("5. Endah Kusuma");
    console.log("   Email    : endah.kusuma@gmail.com");
    console.log("   Password : user123");
    console.log("   Applied  : Marketing Specialist @ Creative Studio");
    console.log("   Status   : IN_REVIEW");
    console.log("");
    console.log("6. Fajar Santoso");
    console.log("   Email    : fajar.santoso@gmail.com");
    console.log("   Password : user123");
    console.log("   Applied  : Backend Engineer @ Fintech Labs");
    console.log("   Status   : INTERVIEW (scheduled in 7 days)");
    console.log("");
    console.log("─".repeat(60));
    console.log("\n🛠️  DEVELOPER ACCOUNT:");
    console.log("─".repeat(60));
    console.log("   Email    : developer@workoo.com");
    console.log("   Password : dev123");
    console.log("   Role     : Manage skill assessments & subscriptions");
    console.log("");
    console.log("=".repeat(60));
    console.log("\n📊 DATABASE SUMMARY:");
    console.log("─".repeat(60));
    console.log(`   Companies: 3`);
    console.log(`   Jobs: 6 (all published)`);
    console.log(`   Pre-selection Tests: 2 (Frontend & Data, 25 questions each)`);
    console.log(`   Users: 9 total (3 admins, 6 seekers, 1 developer)`);
    console.log(`   Applications: 6 (various statuses)`);
    console.log(`   Interviews: 3 scheduled`);
    console.log(`   Test Results: 2 (1 passed, 1 failed)`);
    console.log("=".repeat(60));
    console.log("\n✅ All done! You can now:");
    console.log("   - Login as admin to manage jobs, applicants, interviews");
    console.log("   - Login as user to browse jobs and apply");
    console.log("   - Check pre-selection test flow with test data");
    console.log("   - View analytics with real aggregated data");
    console.log("\n🚀 Ready for testing and demo!\n");
}
comprehensiveSeed()
    .catch((error) => {
    console.error("❌ Seed failed:", error);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=comprehensive-seed.js.map