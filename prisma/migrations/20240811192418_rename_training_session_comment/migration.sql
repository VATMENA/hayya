/*
  Warnings:

  - You are about to drop the `TrainingPlanComment` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "TrainingPlanComment" DROP CONSTRAINT "TrainingPlanComment_trainingSessionId_fkey";

-- DropForeignKey
ALTER TABLE "TrainingPlanComment" DROP CONSTRAINT "TrainingPlanComment_userId_fkey";

-- DropTable
DROP TABLE "TrainingPlanComment";

-- CreateTable
CREATE TABLE "TrainingSessionComment" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "trainingSessionId" TEXT NOT NULL,

    CONSTRAINT "TrainingSessionComment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TrainingSessionComment" ADD CONSTRAINT "TrainingSessionComment_trainingSessionId_fkey" FOREIGN KEY ("trainingSessionId") REFERENCES "TrainingSession"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrainingSessionComment" ADD CONSTRAINT "TrainingSessionComment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
