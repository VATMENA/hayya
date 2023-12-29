-- CreateTable
CREATE TABLE "TrainingQueue" (
    "id" TEXT NOT NULL,
    "vaccId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "joinableByDefault" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TrainingQueue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrainingQueueMembership" (
    "userId" TEXT NOT NULL,
    "queueId" TEXT NOT NULL,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TrainingQueueMembership_pkey" PRIMARY KEY ("userId","queueId")
);

-- AddForeignKey
ALTER TABLE "TrainingQueue" ADD CONSTRAINT "TrainingQueue_vaccId_fkey" FOREIGN KEY ("vaccId") REFERENCES "Vacc"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrainingQueueMembership" ADD CONSTRAINT "TrainingQueueMembership_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrainingQueueMembership" ADD CONSTRAINT "TrainingQueueMembership_queueId_fkey" FOREIGN KEY ("queueId") REFERENCES "TrainingQueue"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
