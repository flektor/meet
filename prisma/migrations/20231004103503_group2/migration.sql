/*
  Warnings:

  - Made the column `locationPin` on table `Group` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Group" ALTER COLUMN "locationPin" SET NOT NULL,
ALTER COLUMN "locationPin" SET DEFAULT '13.404954, 52.520008';
