-- CreateEnum
CREATE TYPE "LogType" AS ENUM ('Training', 'CertificateRevokal');

-- AlterTable
ALTER TABLE "Session" ADD COLUMN     "logType" "LogType" NOT NULL DEFAULT 'Training';
