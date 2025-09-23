-- AlterTable
ALTER TABLE "public"."PreselectionTest" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "passingScore" INTEGER;

-- CreateTable
CREATE TABLE "public"."ApplicantAnswer" (
    "id" SERIAL NOT NULL,
    "resultId" INTEGER NOT NULL,
    "questionId" INTEGER NOT NULL,
    "selected" TEXT NOT NULL,
    "isCorrect" BOOLEAN NOT NULL,

    CONSTRAINT "ApplicantAnswer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ApplicantAnswer_questionId_idx" ON "public"."ApplicantAnswer"("questionId");

-- CreateIndex
CREATE UNIQUE INDEX "ApplicantAnswer_resultId_questionId_key" ON "public"."ApplicantAnswer"("resultId", "questionId");

-- AddForeignKey
ALTER TABLE "public"."ApplicantAnswer" ADD CONSTRAINT "ApplicantAnswer_resultId_fkey" FOREIGN KEY ("resultId") REFERENCES "public"."PreselectionResult"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ApplicantAnswer" ADD CONSTRAINT "ApplicantAnswer_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "public"."PreselectionQuestion"("id") ON DELETE CASCADE ON UPDATE CASCADE;
