/*
  Warnings:

  - You are about to drop the `SubscriptionUsage` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[slug]` on the table `Payment` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slug]` on the table `SkillResult` will be added. If there are existing duplicate values, this will fail.
  - The required column `slug` was added to the `Payment` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `slug` was added to the `SkillResult` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropForeignKey
ALTER TABLE "public"."SubscriptionUsage" DROP CONSTRAINT "SubscriptionUsage_subscriptionId_fkey";

-- AlterTable
ALTER TABLE "Application" ADD COLUMN     "isPriority" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "slug" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "SkillResult" ADD COLUMN     "slug" TEXT NOT NULL;

-- DropTable
DROP TABLE "public"."SubscriptionUsage";

-- CreateIndex
CREATE INDEX "Application_isPriority_createdAt_idx" ON "Application"("isPriority", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_slug_key" ON "Payment"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "SkillResult_slug_key" ON "SkillResult"("slug");
