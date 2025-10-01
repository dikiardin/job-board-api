/*
  Warnings:

  - You are about to alter the column `cultureRating` on the `CompanyReview` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `Decimal(3,2)`.
  - You are about to alter the column `worklifeRating` on the `CompanyReview` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `Decimal(3,2)`.
  - You are about to alter the column `facilityRating` on the `CompanyReview` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `Decimal(3,2)`.
  - You are about to alter the column `careerRating` on the `CompanyReview` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `Decimal(3,2)`.

*/
-- AlterTable
ALTER TABLE "CompanyReview" ADD COLUMN     "companyRating" DECIMAL(3,2),
ALTER COLUMN "cultureRating" DROP NOT NULL,
ALTER COLUMN "cultureRating" SET DATA TYPE DECIMAL(3,2),
ALTER COLUMN "worklifeRating" DROP NOT NULL,
ALTER COLUMN "worklifeRating" SET DATA TYPE DECIMAL(3,2),
ALTER COLUMN "facilityRating" DROP NOT NULL,
ALTER COLUMN "facilityRating" SET DATA TYPE DECIMAL(3,2),
ALTER COLUMN "careerRating" DROP NOT NULL,
ALTER COLUMN "careerRating" SET DATA TYPE DECIMAL(3,2);
