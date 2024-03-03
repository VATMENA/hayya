/*
  Warnings:

  - A unique constraint covering the columns `[facilityId,name]` on the table `Role` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Role_name_key";

-- CreateIndex
CREATE UNIQUE INDEX "Role_facilityId_name_key" ON "Role"("facilityId", "name");
