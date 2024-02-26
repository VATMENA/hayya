/*
  Warnings:

  - A unique constraint covering the columns `[userId,facilityId,assignmentType]` on the table `UserFacilityAssignment` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "UserFacilityAssignment_userId_facilityId_key";

-- CreateIndex
CREATE UNIQUE INDEX "UserFacilityAssignment_userId_facilityId_assignmentType_key" ON "UserFacilityAssignment"("userId", "facilityId", "assignmentType");
