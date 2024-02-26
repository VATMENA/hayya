/*
  Warnings:

  - You are about to drop the column `FacilityId` on the `Resource` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Resource" DROP CONSTRAINT "Resource_FacilityId_fkey";

-- AlterTable
ALTER TABLE "Resource" DROP COLUMN "FacilityId",
ADD COLUMN     "facilityId" TEXT;

-- AddForeignKey
ALTER TABLE "Resource" ADD CONSTRAINT "Resource_facilityId_fkey" FOREIGN KEY ("facilityId") REFERENCES "Facility"("id") ON DELETE SET NULL ON UPDATE CASCADE;
