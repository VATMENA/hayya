-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_vaccId_fkey";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "vaccId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_vaccId_fkey" FOREIGN KEY ("vaccId") REFERENCES "Vacc"("id") ON DELETE SET NULL ON UPDATE CASCADE;
