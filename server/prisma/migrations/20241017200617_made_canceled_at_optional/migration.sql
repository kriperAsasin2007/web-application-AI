/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `Record` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Record" ALTER COLUMN "canceledAt" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Record_userId_key" ON "Record"("userId");
