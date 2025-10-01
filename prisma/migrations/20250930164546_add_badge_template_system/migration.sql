-- AlterTable
ALTER TABLE "public"."SkillAssessment" ADD COLUMN     "badgeTemplateId" INTEGER;

-- AlterTable
ALTER TABLE "public"."UserBadge" ADD COLUMN     "assessmentId" INTEGER,
ADD COLUMN     "badgeTemplateId" INTEGER,
ADD COLUMN     "badgeType" TEXT NOT NULL DEFAULT 'skill';

-- CreateTable
CREATE TABLE "public"."BadgeTemplate" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "icon" TEXT,
    "description" TEXT,
    "category" TEXT,
    "createdBy" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BadgeTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BadgeTemplate_name_key" ON "public"."BadgeTemplate"("name");

-- AddForeignKey
ALTER TABLE "public"."SkillAssessment" ADD CONSTRAINT "SkillAssessment_badgeTemplateId_fkey" FOREIGN KEY ("badgeTemplateId") REFERENCES "public"."BadgeTemplate"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."BadgeTemplate" ADD CONSTRAINT "BadgeTemplate_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserBadge" ADD CONSTRAINT "UserBadge_assessmentId_fkey" FOREIGN KEY ("assessmentId") REFERENCES "public"."SkillAssessment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserBadge" ADD CONSTRAINT "UserBadge_badgeTemplateId_fkey" FOREIGN KEY ("badgeTemplateId") REFERENCES "public"."BadgeTemplate"("id") ON DELETE SET NULL ON UPDATE CASCADE;
