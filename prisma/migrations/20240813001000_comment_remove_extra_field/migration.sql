/*
  Warnings:

  - You are about to drop the column `trainingSessionId` on the `TrainingSessionComment` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "TrainingSessionComment" DROP CONSTRAINT "TrainingSessionComment_trainingSessionId_fkey";

-- AlterTable
ALTER TABLE "TrainingSessionComment" DROP COLUMN "trainingSessionId";

-- AddForeignKey
ALTER TABLE "TrainingSessionComment" ADD CONSTRAINT "TrainingSessionComment_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "TrainingSession"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
