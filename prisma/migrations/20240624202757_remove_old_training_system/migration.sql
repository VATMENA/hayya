/*
  Warnings:

  - You are about to drop the column `completedTrainingQueues` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `recommendedTrainingQueues` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Session` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TrainingQueue` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TrainingQueueMembership` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TrainingRequest` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Session" DROP CONSTRAINT "Session_instructorId_fkey";

-- DropForeignKey
ALTER TABLE "Session" DROP CONSTRAINT "Session_studentId_fkey";

-- DropForeignKey
ALTER TABLE "TrainingQueue" DROP CONSTRAINT "TrainingQueue_facilityId_fkey";

-- DropForeignKey
ALTER TABLE "TrainingQueueMembership" DROP CONSTRAINT "TrainingQueueMembership_queueId_fkey";

-- DropForeignKey
ALTER TABLE "TrainingQueueMembership" DROP CONSTRAINT "TrainingQueueMembership_userId_fkey";

-- DropForeignKey
ALTER TABLE "TrainingRequest" DROP CONSTRAINT "TrainingRequest_facilityId_fkey";

-- DropForeignKey
ALTER TABLE "TrainingRequest" DROP CONSTRAINT "TrainingRequest_instructorId_fkey";

-- DropForeignKey
ALTER TABLE "TrainingRequest" DROP CONSTRAINT "TrainingRequest_studentId_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "completedTrainingQueues",
DROP COLUMN "recommendedTrainingQueues";

-- DropTable
DROP TABLE "Session";

-- DropTable
DROP TABLE "TrainingQueue";

-- DropTable
DROP TABLE "TrainingQueueMembership";

-- DropTable
DROP TABLE "TrainingRequest";

-- DropEnum
DROP TYPE "LogType";
