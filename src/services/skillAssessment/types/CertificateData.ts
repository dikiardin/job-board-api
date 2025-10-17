export interface CertificateData {
  userName: string;
  userEmail: string;
  assessmentTitle: string;
  assessmentDescription?: string;
  score: number;
  totalQuestions: number;
  completedAt: Date;
  userId: number;
  certificateCode: string;
  badgeIcon?: string;
  badgeName?: string;
}
