"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedAssessments = seedAssessments;
const questionUtils_1 = require("./questionUtils");
async function seedAssessments({ prisma, now, addDays, users, }) {
    const { developer, seekers } = users;
    const badgeTemplateFrontend = await prisma.badgeTemplate.create({
        data: {
            name: "Frontend Specialist",
            icon: "https://placehold.co/64x64?text=FE",
            description: "Awarded for passing the Frontend mastery assessment with >= 75 score.",
            category: "Engineering",
            createdBy: developer.id,
        },
    });
    const badgeTemplateData = await prisma.badgeTemplate.create({
        data: {
            name: "Data Insights Expert",
            icon: "https://placehold.co/64x64?text=DS",
            description: "Awarded for exceptional performance in data science assessments.",
            category: "Data",
            createdBy: developer.id,
        },
    });
    const assessmentFrontend = await prisma.skillAssessment.create({
        data: {
            title: "Frontend Mastery",
            slug: "frontend-mastery",
            description: "25-question assessment covering accessibility, performance, testing.",
            category: "Frontend",
            createdBy: developer.id,
            badgeTemplateId: badgeTemplateFrontend.id,
            questions: {
                create: (0, questionUtils_1.buildMCQ)("Frontend Assessment", 25, "A", {
                    A: "Always",
                    B: "Sometimes",
                    C: "Rarely",
                    D: "Never",
                }),
            },
        },
    });
    const assessmentData = await prisma.skillAssessment.create({
        data: {
            title: "Data Science Challenge",
            slug: "data-science-challenge",
            description: "25-question assessment covering statistics, machine learning, and SQL.",
            category: "Data Science",
            createdBy: developer.id,
            badgeTemplateId: badgeTemplateData.id,
            questions: {
                create: (0, questionUtils_1.buildMCQ)("Data Assessment", 25, "B", {
                    A: "Strongly disagree",
                    B: "Agree",
                    C: "Neutral",
                    D: "Disagree",
                }),
            },
        },
    });
    // NEW: Testing Assessment with only 2 questions
    const badgeTemplateTest = await prisma.badgeTemplate.create({
        data: {
            name: "Quick Test Expert",
            icon: "https://placehold.co/64x64?text=QT",
            description: "Awarded for passing the quick test assessment with >= 75% score.",
            category: "Testing",
            createdBy: developer.id,
        },
    });
    const assessmentTest = await prisma.skillAssessment.create({
        data: {
            title: "Quick Test Assessment",
            slug: "quick-test-assessment",
            description: "2-question assessment for testing purposes. Perfect for quick validation of the assessment system.",
            category: "Testing",
            createdBy: developer.id,
            badgeTemplateId: badgeTemplateTest.id,
            questions: {
                create: [
                    {
                        question: "What is the primary purpose of unit testing in software development?",
                        options: [
                            "To test the entire application end-to-end",
                            "To test individual components or functions in isolation",
                            "To test database connections only",
                            "To test user interface elements"
                        ],
                        answer: "To test individual components or functions in isolation",
                    },
                    {
                        question: "Which HTTP status code indicates a successful response?",
                        options: [
                            "404 - Not Found",
                            "500 - Internal Server Error",
                            "200 - OK",
                            "401 - Unauthorized"
                        ],
                        answer: "200 - OK",
                    },
                ],
            },
        },
    });
    // NEW: JavaScript Fundamentals Assessment with 2 questions
    const badgeTemplateJavaScript = await prisma.badgeTemplate.create({
        data: {
            name: "JavaScript Expert",
            icon: "https://placehold.co/64x64?text=JS",
            description: "Awarded for mastering JavaScript fundamentals with >= 75% score.",
            category: "Programming",
            createdBy: developer.id,
        },
    });
    const assessmentJavaScript = await prisma.skillAssessment.create({
        data: {
            title: "JavaScript Fundamentals",
            slug: "javascript-fundamentals",
            description: "2-question assessment covering core JavaScript concepts and ES6+ features.",
            category: "Programming",
            createdBy: developer.id,
            badgeTemplateId: badgeTemplateJavaScript.id,
            questions: {
                create: [
                    {
                        question: "What is the difference between 'let' and 'var' in JavaScript?",
                        options: [
                            "There is no difference, they are interchangeable",
                            "'let' has block scope while 'var' has function scope",
                            "'var' has block scope while 'let' has function scope",
                            "'let' is used for constants while 'var' is for variables"
                        ],
                        answer: "'let' has block scope while 'var' has function scope",
                    },
                    {
                        question: "Which method is used to add an element to the end of an array in JavaScript?",
                        options: [
                            "array.append()",
                            "array.add()",
                            "array.push()",
                            "array.insert()"
                        ],
                        answer: "array.push()",
                    },
                ],
            },
        },
    });
    // NEW: React Basics Assessment with 2 questions
    const badgeTemplateReact = await prisma.badgeTemplate.create({
        data: {
            name: "React Developer",
            icon: "https://placehold.co/64x64?text=RX",
            description: "Awarded for demonstrating React knowledge with >= 75% score.",
            category: "Frontend",
            createdBy: developer.id,
        },
    });
    const assessmentReact = await prisma.skillAssessment.create({
        data: {
            title: "React Basics",
            slug: "react-basics",
            description: "2-question assessment covering React components, hooks, and state management.",
            category: "Frontend",
            createdBy: developer.id,
            badgeTemplateId: badgeTemplateReact.id,
            questions: {
                create: [
                    {
                        question: "What is the purpose of the useState hook in React?",
                        options: [
                            "To handle component lifecycle methods",
                            "To manage component state in functional components",
                            "To connect to external APIs",
                            "To optimize component performance"
                        ],
                        answer: "To manage component state in functional components",
                    },
                    {
                        question: "What is JSX in React?",
                        options: [
                            "A new programming language",
                            "A database query language",
                            "A syntax extension that allows writing HTML-like code in JavaScript",
                            "A CSS framework for styling React components"
                        ],
                        answer: "A syntax extension that allows writing HTML-like code in JavaScript",
                    },
                ],
            },
        },
    });
    const aliceAssessmentStart = addDays(-1);
    const aliceSkillResult = await prisma.skillResult.create({
        data: {
            userId: seekers.alice.id,
            assessmentId: assessmentFrontend.id,
            score: 92,
            isPassed: true,
            answers: {
                strengths: ["Accessibility", "Testing"],
                improvements: ["Micro frontends"],
            },
            startedAt: aliceAssessmentStart,
            finishedAt: new Date(aliceAssessmentStart.getTime() + 15 * 60 * 1000),
            durationSeconds: 900,
            certificateUrl: "https://res.cloudinary.com/demo/certificates/alice-fe.pdf",
            certificateCode: "CERT-FE-ALICE-001",
        },
    });
    await prisma.certificate.create({
        data: {
            code: "CERT-FE-ALICE-001",
            userId: seekers.alice.id,
            assessmentId: assessmentFrontend.id,
            skillResultId: aliceSkillResult.id,
            pdfUrl: "https://res.cloudinary.com/demo/certificates/alice-fe.pdf",
            qrUrl: "https://jobboard.local/qr/CERT-FE-ALICE-001.png",
            verificationUrl: "https://jobboard.local/verify/certificate/CERT-FE-ALICE-001",
            issuedAt: now,
            issuerId: developer.id,
        },
    });
    const ginaAssessmentStart = addDays(-2);
    const ginaSkillResult = await prisma.skillResult.create({
        data: {
            userId: seekers.gina.id,
            assessmentId: assessmentData.id,
            score: 88,
            isPassed: true,
            answers: {
                strengths: ["User research", "Rapid prototyping"],
            },
            startedAt: ginaAssessmentStart,
            finishedAt: new Date(ginaAssessmentStart.getTime() + 20 * 60 * 1000),
            durationSeconds: 1200,
            certificateUrl: "https://res.cloudinary.com/demo/certificates/gina-data.pdf",
            certificateCode: "CERT-DATA-GINA-001",
        },
    });
    await prisma.certificate.create({
        data: {
            code: "CERT-DATA-GINA-001",
            userId: seekers.gina.id,
            assessmentId: assessmentData.id,
            skillResultId: ginaSkillResult.id,
            pdfUrl: "https://res.cloudinary.com/demo/certificates/gina-data.pdf",
            verificationUrl: "https://jobboard.local/verify/certificate/CERT-DATA-GINA-001",
            issuedAt: addDays(-2),
            issuerId: developer.id,
        },
    });
    const bobSkillResult = await prisma.skillResult.create({
        data: {
            userId: seekers.bob.id,
            assessmentId: assessmentData.id,
            score: 68,
            isPassed: false,
            answers: {
                summary: "Needs stronger foundation in statistics.",
            },
            startedAt: addDays(-3),
            finishedAt: addDays(-3),
            durationSeconds: 1400,
        },
    });
    // Testing Users Skill Results
    const testProfessionalSkillResult = await prisma.skillResult.create({
        data: {
            userId: seekers.testProfessional.id,
            assessmentId: assessmentJavaScript.id,
            score: 2,
            isPassed: true,
            answers: {
                strengths: ["JavaScript fundamentals", "ES6+ features"],
                improvements: ["Advanced patterns"],
            },
            startedAt: addDays(-1),
            finishedAt: new Date(addDays(-1).getTime() + 10 * 60 * 1000),
            durationSeconds: 600,
            certificateUrl: "https://res.cloudinary.com/demo/certificates/test-professional-js.pdf",
            certificateCode: "CERT-JS-TESTPRO-001",
        },
    });
    const testStandardSkillResult = await prisma.skillResult.create({
        data: {
            userId: seekers.testStandard.id,
            assessmentId: assessmentReact.id,
            score: 2,
            isPassed: true,
            answers: {
                strengths: ["React hooks", "Component structure"],
                improvements: ["State management"],
            },
            startedAt: addDays(-2),
            finishedAt: new Date(addDays(-2).getTime() + 12 * 60 * 1000),
            durationSeconds: 720,
            certificateUrl: "https://res.cloudinary.com/demo/certificates/test-standard-react.pdf",
            certificateCode: "CERT-REACT-TESTSTD-001",
        },
    });
    const badgePriorityReviewer = await prisma.badge.create({
        data: {
            name: "Priority Reviewer",
            icon: "https://placehold.co/64x64?text=PR",
            criteria: "Granted to Professional subscribers with active priority review.",
            category: "Community",
            createdBy: developer.id,
        },
    });
    return {
        badgeTemplates: {
            frontend: badgeTemplateFrontend,
            data: badgeTemplateData,
            test: badgeTemplateTest,
            javascript: badgeTemplateJavaScript,
            react: badgeTemplateReact
        },
        assessments: {
            frontend: assessmentFrontend,
            data: assessmentData,
            test: assessmentTest,
            javascript: assessmentJavaScript,
            react: assessmentReact
        },
        badgePriorityReviewer,
        skillResults: {
            alice: aliceSkillResult,
            gina: ginaSkillResult,
            bob: bobSkillResult,
            testProfessional: testProfessionalSkillResult,
            testStandard: testStandardSkillResult
        },
    };
}
