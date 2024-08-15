/*
  Warnings:

  - Added the required column `facilityId` to the `TrainingRequest` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TrainingRequest" ADD COLUMN     "facilityId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "TrainingRequest" ADD CONSTRAINT "TrainingRequest_facilityId_fkey" FOREIGN KEY ("facilityId") REFERENCES "Facility"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
