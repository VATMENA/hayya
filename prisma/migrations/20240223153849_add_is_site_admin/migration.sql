/*
  Warnings:

  - You are about to drop the column `certificatesAlreadyGrandfathered` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "certificatesAlreadyGrandfathered",
ADD COLUMN     "isSiteAdmin" BOOLEAN NOT NULL DEFAULT false;
