/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `Activity` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `Activity` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Activity" ADD COLUMN     "slug" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Activity_slug_key" ON "Activity"("slug");
