/*
  Warnings:

  - The `status` column on the `services` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "serviceStatus" AS ENUM ('available', 'un_available');

-- AlterTable
ALTER TABLE "services" DROP COLUMN "status",
ADD COLUMN     "status" "serviceStatus" DEFAULT 'available';
