/*
  Warnings:

  - Added the required column `estimatedTimeToCompleteTraining` to the `TrainingPlan` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TrainingPlan" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "estimatedTimeToCompleteTraining" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "TrainingPlanRegistration" (
    "id" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TrainingPlanRegistration_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TrainingPlanRegistration" ADD CONSTRAINT "TrainingPlanRegistration_planId_fkey" FOREIGN KEY ("planId") REFERENCES "TrainingPlan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrainingPlanRegistration" ADD CONSTRAINT "TrainingPlanRegistration_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
