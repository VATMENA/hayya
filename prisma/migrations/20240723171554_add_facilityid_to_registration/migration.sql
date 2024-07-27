/*
  Warnings:

  - Added the required column `facilityId` to the `TrainingPlanRegistrationRequest` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TrainingPlanRegistrationRequest" ADD COLUMN     "facilityId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "TrainingPlanRegistrationRequest" ADD CONSTRAINT "TrainingPlanRegistrationRequest_facilityId_fkey" FOREIGN KEY ("facilityId") REFERENCES "Facility"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
