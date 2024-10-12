/*
  Warnings:

  - Added the required column `facilityId` to the `TrainingPlanRegistration` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TrainingPlanRegistration" ADD COLUMN     "facilityId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "TrainingPlanRegistration" ADD CONSTRAINT "TrainingPlanRegistration_facilityId_fkey" FOREIGN KEY ("facilityId") REFERENCES "Facility"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
