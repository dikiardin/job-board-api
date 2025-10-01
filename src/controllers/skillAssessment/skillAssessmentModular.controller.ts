// This file exports all modular controllers for easy import
// Each controller is now under 200 lines and focused on specific functionality

export { AssessmentCreationController } from "./assessmentCreation.controller";
export { AssessmentExecutionController } from "./assessmentExecution.controller";
export { CertificateBadgeController } from "./certificateBadge.controller";
// export { BadgeTemplateRefactoredController } from "./badgeTemplateRefactored.controller"; // Commented out - file doesn't exist

// Re-export for backward compatibility
import { AssessmentCreationController } from "./assessmentCreation.controller";
import { AssessmentExecutionController } from "./assessmentExecution.controller";
import { CertificateBadgeController } from "./certificateBadge.controller";

export class SkillAssessmentModularController {
  // Assessment Creation Methods (Developer Only)
  static createAssessment = AssessmentCreationController.createAssessment;
  static getAssessmentsForManagement = AssessmentCreationController.getAssessmentsForManagement;
  static getAssessmentForEditing = AssessmentCreationController.getAssessmentForEditing;
  static updateAssessment = AssessmentCreationController.updateAssessment;
  static deleteAssessment = AssessmentCreationController.deleteAssessment;
  static getDeveloperAssessments = AssessmentCreationController.getDeveloperAssessments;
  static searchAssessments = AssessmentCreationController.searchAssessments;
  static getAssessmentStatistics = AssessmentCreationController.getAssessmentStatistics;
  static duplicateAssessment = AssessmentCreationController.duplicateAssessment;

  // Assessment Execution Methods (User with Subscription)
  static getAssessmentsForDiscovery = AssessmentExecutionController.getAssessmentsForDiscovery;
  static getAssessmentForTaking = AssessmentExecutionController.getAssessmentForTaking;
  static submitAssessment = AssessmentExecutionController.submitAssessment;
  static getUserAssessmentResults = AssessmentExecutionController.getUserAssessmentResults;
  static getAssessmentResult = AssessmentExecutionController.getUserAssessmentResults;
  static getAssessmentLeaderboard = AssessmentExecutionController.getAssessmentLeaderboard;
  static getAssessmentStats = AssessmentExecutionController.getAssessmentStats;
  static retakeAssessment = AssessmentExecutionController.canRetakeAssessment;
  static canRetakeAssessment = AssessmentExecutionController.canRetakeAssessment;
  static getTimeRemaining = AssessmentExecutionController.getTimeRemaining;
  // static saveAssessmentProgress = AssessmentExecutionController.saveAssessmentProgress; // Method doesn't exist

  // Certificate and Badge Methods
  static verifyCertificate = CertificateBadgeController.verifyCertificate;
  static downloadCertificate = CertificateBadgeController.downloadCertificate;
  static getUserCertificates = CertificateBadgeController.getUserCertificates;
  static shareCertificate = CertificateBadgeController.shareCertificate;
  static getCertificateAnalytics = CertificateBadgeController.getCertificateAnalytics;
  static getUserBadges = CertificateBadgeController.getUserBadges;
  static getBadgeDetails = CertificateBadgeController.getBadgeDetails;
  static verifyBadge = CertificateBadgeController.verifyBadge;
  static getBadgeAnalytics = CertificateBadgeController.getBadgeAnalytics;
  static getBadgeLeaderboard = CertificateBadgeController.getBadgeLeaderboard;
  static getUserBadgeProgress = CertificateBadgeController.getUserBadgeProgress;
  static shareBadge = CertificateBadgeController.shareBadge;
}

// Default export for backward compatibility
export default SkillAssessmentModularController;
