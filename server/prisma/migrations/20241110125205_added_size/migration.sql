-- CreateEnum
CREATE TYPE "Size" AS ENUM ('LARGE', 'MEDIUM', 'SMALL');

-- AlterTable
ALTER TABLE "Record" ADD COLUMN     "size" "Size";
