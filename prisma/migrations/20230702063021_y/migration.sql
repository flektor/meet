/*
  Warnings:

  - The required column `id` was added to the `ActivityViewer` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "ActivityViewer" ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "ActivityViewer_pkey" PRIMARY KEY ("id");
