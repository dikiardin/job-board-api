/*
  Warnings:

  - You are about to drop the column `title` on the `GeneratedCV` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "public"."SkillResult_userId_assessmentId_key";

-- AlterTable
ALTER TABLE "GeneratedCV" DROP COLUMN "title";

-- CreateIndex
CREATE INDEX "SkillResult_userId_assessmentId_idx" ON "SkillResult"("userId", "assessmentId");
