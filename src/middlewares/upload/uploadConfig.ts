import { uploadSingle, uploadMultiple, uploadFields } from './imageFileFilter';
import { uploadPaymentProofSingle } from './paymentProofFileFilter';

// Re-export all upload functions for easy access
export {
  uploadSingle,
  uploadMultiple,
  uploadFields,
  uploadPaymentProofSingle
};

// Default upload configuration
export const uploadConfig = {
  maxFileSize: 5 * 1024 * 1024, // 5MB
  allowedImageTypes: ['jpeg', 'jpg', 'png', 'gif', 'webp'],
  allowedDocumentTypes: ['pdf'],
  allowedPaymentProofTypes: ['jpeg', 'jpg', 'png', 'gif', 'webp', 'pdf']
};
