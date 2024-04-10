-- CreateEnum
CREATE TYPE "TVCaseType" AS ENUM ('Visit', 'Transfer');

-- CreateEnum
CREATE TYPE "TVCaseState" AS ENUM ('Pending', 'InReview', 'AdditionalInformationNeeded', 'Rejected', 'Accepted');

-- AlterTable
ALTER TABLE "UserFacilityAssignment" ADD COLUMN     "caseId" BIGINT;

-- CreateTable
CREATE TABLE "TVCase" (
    "id" BIGSERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "facilityId" TEXT NOT NULL,
    "caseType" "TVCaseType" NOT NULL,
    "caseState" "TVCaseState" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TVCase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TVCaseComment" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "caseId" BIGINT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TVCaseComment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TVCaseStateChange" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "caseId" BIGINT NOT NULL,
    "before" "TVCaseState" NOT NULL,
    "after" "TVCaseState" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TVCaseStateChange_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "UserFacilityAssignment" ADD CONSTRAINT "UserFacilityAssignment_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "TVCase"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TVCase" ADD CONSTRAINT "TVCase_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TVCase" ADD CONSTRAINT "TVCase_facilityId_fkey" FOREIGN KEY ("facilityId") REFERENCES "Facility"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TVCaseComment" ADD CONSTRAINT "TVCaseComment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TVCaseComment" ADD CONSTRAINT "TVCaseComment_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "TVCase"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TVCaseStateChange" ADD CONSTRAINT "TVCaseStateChange_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TVCaseStateChange" ADD CONSTRAINT "TVCaseStateChange_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "TVCase"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
