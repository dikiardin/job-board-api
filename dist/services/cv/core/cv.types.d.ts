export interface CVData {
    personalInfo: {
        name: string;
        email: string;
        phone?: string | null;
        address?: string | null;
        profilePicture?: string | null;
        linkedin?: string | undefined;
        portfolio?: string | undefined;
    };
    education?: string | null;
    employments: Array<{
        company: string;
        startDate: Date | null;
        endDate: Date | null;
        position: string;
    }>;
    skills: string[];
    projects?: Array<{
        name: string;
        description: string;
        technologies: string[];
        url?: string;
    }>;
    certifications?: Array<{
        name: string;
        issuer: string;
        date: string;
        link?: string;
    }>;
    languages?: Array<{
        name: string;
        level: string;
    }>;
    skillCategories?: Record<string, string[]>;
    objective?: string | undefined;
    badges: Array<{
        name: string;
        icon?: string | null;
        awardedAt: Date;
    }>;
    additionalInfo?: CVAdditionalInfo | undefined;
}
export interface CVAdditionalInfo {
    fullName?: string;
    email?: string;
    phone?: string;
    address?: string;
    objective?: string;
    skills?: string[];
    skillCategories?: Record<string, string[]>;
    linkedin?: string;
    portfolio?: string;
    workExperience?: Array<{
        company: string;
        position: string;
        startDate: string;
        endDate: string;
        responsibilities: string[];
    }>;
    educationDetails?: Array<{
        institution: string;
        degree: string;
        year: string;
        gpa?: string;
    }>;
    languages?: Array<{
        name: string;
        level: string;
    }>;
    certifications?: Array<{
        name: string;
        issuer: string;
        date: string;
        link?: string;
    }>;
    projects?: Array<{
        name: string;
        description: string;
        technologies: string[];
        url?: string;
    }>;
    references?: Array<{
        name: string;
        position: string;
        company: string;
        phone: string;
        email: string;
    }>;
}
export interface CVTemplate {
    id: string;
    name: string;
    description: string;
    isATS: boolean;
}
//# sourceMappingURL=cv.types.d.ts.map