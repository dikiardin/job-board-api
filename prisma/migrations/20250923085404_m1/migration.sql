/*
  Warnings:

  - You are about to drop the column `isVerified` on the `Employment` table. All the data in the column will be lost.
  - You are about to drop the `CompanyAdmin` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[adminId]` on the table `Company` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "public"."CompanyAdmin" DROP CONSTRAINT "CompanyAdmin_companyId_fkey";

-- DropForeignKey
ALTER TABLE "public"."CompanyAdmin" DROP CONSTRAINT "CompanyAdmin_userId_fkey";

-- AlterTable
ALTER TABLE "public"."Company" ADD COLUMN     "adminId" INTEGER;

-- AlterTable
ALTER TABLE "public"."Employment" DROP COLUMN "isVerified";

-- DropTable
DROP TABLE "public"."CompanyAdmin";

-- CreateIndex
CREATE UNIQUE INDEX "Company_adminId_key" ON "public"."Company"("adminId");

-- AddForeignKey
ALTER TABLE "public"."Company" ADD CONSTRAINT "Company_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
