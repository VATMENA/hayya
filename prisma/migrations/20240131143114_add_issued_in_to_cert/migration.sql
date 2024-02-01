/*
  Warnings:

  - Added the required column `issuedInId` to the `Certificate` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Certificate" ADD COLUMN     "issuedInId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Certificate" ADD CONSTRAINT "Certificate_issuedInId_fkey" FOREIGN KEY ("issuedInId") REFERENCES "Vacc"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
