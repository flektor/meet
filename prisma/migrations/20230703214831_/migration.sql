/*
  Warnings:

  - The primary key for the `ActivityViewer` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `ActivityViewer` table. All the data in the column will be lost.
  - The primary key for the `GroupViewer` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `GroupViewer` table. All the data in the column will be lost.
  - The primary key for the `PendingInvite` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `PendingInvite` table. All the data in the column will be lost.
  - You are about to drop the column `groupId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `_GroupToUser` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[id,userId,activityId]` on the table `Group` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId]` on the table `GroupViewer` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,groupId]` on the table `GroupViewer` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,groupId]` on the table `PendingInvite` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `Group` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_GroupToUser" DROP CONSTRAINT "_GroupToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_GroupToUser" DROP CONSTRAINT "_GroupToUser_B_fkey";

-- DropIndex
DROP INDEX "Group_id_activityId_key";

-- AlterTable
ALTER TABLE "ActivityViewer" DROP CONSTRAINT "ActivityViewer_pkey",
DROP COLUMN "id";

-- AlterTable
ALTER TABLE "Group" ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "GroupViewer" DROP CONSTRAINT "GroupViewer_pkey",
DROP COLUMN "id";

-- AlterTable
ALTER TABLE "PendingInvite" DROP CONSTRAINT "PendingInvite_pkey",
DROP COLUMN "id";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "groupId";

-- DropTable
DROP TABLE "_GroupToUser";

-- CreateTable
CREATE TABLE "Membership" (
    "userId" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,

    CONSTRAINT "Membership_pkey" PRIMARY KEY ("userId","groupId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Group_id_userId_activityId_key" ON "Group"("id", "userId", "activityId");

-- CreateIndex
CREATE UNIQUE INDEX "GroupViewer_userId_key" ON "GroupViewer"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "GroupViewer_userId_groupId_key" ON "GroupViewer"("userId", "groupId");

-- CreateIndex
CREATE UNIQUE INDEX "PendingInvite_userId_groupId_key" ON "PendingInvite"("userId", "groupId");

-- AddForeignKey
ALTER TABLE "Group" ADD CONSTRAINT "Group_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Membership" ADD CONSTRAINT "Membership_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Membership" ADD CONSTRAINT "Membership_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
