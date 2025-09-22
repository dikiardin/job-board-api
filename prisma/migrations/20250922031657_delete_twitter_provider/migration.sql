/*
  Warnings:

  - The values [TWITTER] on the enum `ProviderType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "public"."ProviderType_new" AS ENUM ('GOOGLE', 'FACEBOOK');
ALTER TABLE "public"."UserProvider" ALTER COLUMN "provider" TYPE "public"."ProviderType_new" USING ("provider"::text::"public"."ProviderType_new");
ALTER TYPE "public"."ProviderType" RENAME TO "ProviderType_old";
ALTER TYPE "public"."ProviderType_new" RENAME TO "ProviderType";
DROP TYPE "public"."ProviderType_old";
COMMIT;
