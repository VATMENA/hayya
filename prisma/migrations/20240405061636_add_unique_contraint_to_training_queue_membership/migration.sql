/*
  Warnings:

  - A unique constraint covering the columns `[userId,queueId]` on the table `TrainingQueueMembership` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "TrainingQueueMembership_userId_queueId_key" ON "TrainingQueueMembership"("userId", "queueId");
