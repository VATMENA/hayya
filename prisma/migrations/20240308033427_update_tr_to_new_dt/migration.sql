-- CreateTable
CREATE TABLE "TrainingRequest" (
    "id" TEXT NOT NULL,
    "facilityId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "instructorId" TEXT,
    "trainingType" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "availability" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TrainingRequest_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TrainingRequest" ADD CONSTRAINT "TrainingRequest_facilityId_fkey" FOREIGN KEY ("facilityId") REFERENCES "Facility"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrainingRequest" ADD CONSTRAINT "TrainingRequest_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrainingRequest" ADD CONSTRAINT "TrainingRequest_instructorId_fkey" FOREIGN KEY ("instructorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
