/*
  Warnings:

  - Added the required column `extraDetails` to the `TrainingPlan` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TrainingPlan" ADD COLUMN     "extraDetails" TEXT NOT NULL;
