-- CreateTable
CREATE TABLE "Resource" (
    "id" TEXT NOT NULL,
    "vaccId" TEXT,
    "isStaffOnly" BOOLEAN NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "link" TEXT NOT NULL,

    CONSTRAINT "Resource_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Resource" ADD CONSTRAINT "Resource_vaccId_fkey" FOREIGN KEY ("vaccId") REFERENCES "Vacc"("id") ON DELETE SET NULL ON UPDATE CASCADE;
