/*
  Warnings:

  - You are about to drop the column `vaccId` on the `Resource` table. All the data in the column will be lost.
  - You are about to drop the column `vaccId` on the `TrainingQueue` table. All the data in the column will be lost.
  - You are about to drop the column `roleIds` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `vaccId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Vacc` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `color` to the `Role` table without a default value. This is not possible if the table is not empty.
  - Added the required column `facilityId` to the `Role` table without a default value. This is not possible if the table is not empty.
  - Added the required column `facilityId` to the `TrainingQueue` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "FacilityType" AS ENUM ('Subdivision', 'Division');

-- CreateEnum
CREATE TYPE "FacilityAssignmentType" AS ENUM ('Primary', 'Secondary');

-- DropForeignKey
ALTER TABLE "Certificate" DROP CONSTRAINT "Certificate_issuedInId_fkey";

-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_hostId_fkey";

-- DropForeignKey
ALTER TABLE "Resource" DROP CONSTRAINT "Resource_vaccId_fkey";

-- DropForeignKey
ALTER TABLE "TrainingQueue" DROP CONSTRAINT "TrainingQueue_vaccId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_vaccId_fkey";

-- AlterTable
ALTER TABLE "Resource" DROP COLUMN "vaccId",
ADD COLUMN     "FacilityId" TEXT;

-- AlterTable
ALTER TABLE "Role" ADD COLUMN     "color" TEXT NOT NULL,
ADD COLUMN     "facilityId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "TrainingQueue" DROP COLUMN "vaccId",
ADD COLUMN     "facilityId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "roleIds",
DROP COLUMN "vaccId";

-- DropTable
DROP TABLE "Vacc";

-- CreateTable
CREATE TABLE "Facility" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "dotnetId" TEXT NOT NULL,
    "dotnetType" "FacilityType" NOT NULL,
    "website" TEXT NOT NULL,
    "contactEmail" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Facility_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserFacilityAssignment" (
    "id" TEXT NOT NULL,
    "assignmentType" "FacilityAssignmentType" NOT NULL,
    "userId" TEXT NOT NULL,
    "facilityId" TEXT NOT NULL,

    CONSTRAINT "UserFacilityAssignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_RoleToUserFacilityAssignment" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Facility_name_key" ON "Facility"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Facility_dotnetId_key" ON "Facility"("dotnetId");

-- CreateIndex
CREATE UNIQUE INDEX "UserFacilityAssignment_userId_facilityId_key" ON "UserFacilityAssignment"("userId", "facilityId");

-- CreateIndex
CREATE UNIQUE INDEX "_RoleToUserFacilityAssignment_AB_unique" ON "_RoleToUserFacilityAssignment"("A", "B");

-- CreateIndex
CREATE INDEX "_RoleToUserFacilityAssignment_B_index" ON "_RoleToUserFacilityAssignment"("B");

-- AddForeignKey
ALTER TABLE "Role" ADD CONSTRAINT "Role_facilityId_fkey" FOREIGN KEY ("facilityId") REFERENCES "Facility"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserFacilityAssignment" ADD CONSTRAINT "UserFacilityAssignment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserFacilityAssignment" ADD CONSTRAINT "UserFacilityAssignment_facilityId_fkey" FOREIGN KEY ("facilityId") REFERENCES "Facility"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrainingQueue" ADD CONSTRAINT "TrainingQueue_facilityId_fkey" FOREIGN KEY ("facilityId") REFERENCES "Facility"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Certificate" ADD CONSTRAINT "Certificate_issuedInId_fkey" FOREIGN KEY ("issuedInId") REFERENCES "Facility"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Resource" ADD CONSTRAINT "Resource_FacilityId_fkey" FOREIGN KEY ("FacilityId") REFERENCES "Facility"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_hostId_fkey" FOREIGN KEY ("hostId") REFERENCES "Facility"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RoleToUserFacilityAssignment" ADD CONSTRAINT "_RoleToUserFacilityAssignment_A_fkey" FOREIGN KEY ("A") REFERENCES "Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RoleToUserFacilityAssignment" ADD CONSTRAINT "_RoleToUserFacilityAssignment_B_fkey" FOREIGN KEY ("B") REFERENCES "UserFacilityAssignment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
