/*
  Warnings:

  - You are about to drop the column `userId` on the `Group` table. All the data in the column will be lost.
  - You are about to drop the column `channelId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Favorites` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Registrations` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[userId]` on the table `ActivityViewer` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id,activityId]` on the table `Group` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `createdBy` to the `Activity` table without a default value. This is not possible if the table is not empty.
  - Added the required column `createdBy` to the `Group` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Group_id_userId_activityId_key";

-- AlterTable
ALTER TABLE "Activity" ADD COLUMN     "createdBy" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Group" DROP COLUMN "userId",
ADD COLUMN     "createdBy" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "channelId";

-- DropTable
DROP TABLE "Favorites";

-- DropTable
DROP TABLE "Registrations";

-- CreateTable
CREATE TABLE "Favorite" (
    "userId" TEXT NOT NULL,
    "activityId" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Registration" (
    "userId" TEXT NOT NULL,
    "activityId" TEXT NOT NULL
);

-- CreateIndex
CREATE INDEX "Favorite_activityId_idx" ON "Favorite"("activityId");

-- CreateIndex
CREATE UNIQUE INDEX "Favorite_userId_activityId_key" ON "Favorite"("userId", "activityId");

-- CreateIndex
CREATE INDEX "Registration_activityId_idx" ON "Registration"("activityId");

-- CreateIndex
CREATE UNIQUE INDEX "Registration_userId_activityId_key" ON "Registration"("userId", "activityId");

-- CreateIndex
CREATE INDEX "Account_userId_idx" ON "Account"("userId");

-- CreateIndex
CREATE INDEX "Activity_createdBy_idx" ON "Activity"("createdBy");

-- CreateIndex
CREATE UNIQUE INDEX "ActivityViewer_userId_key" ON "ActivityViewer"("userId");

-- CreateIndex
CREATE INDEX "ActivityViewer_activityId_idx" ON "ActivityViewer"("activityId");

-- CreateIndex
CREATE INDEX "Group_activityId_idx" ON "Group"("activityId");

-- CreateIndex
CREATE INDEX "Group_createdBy_idx" ON "Group"("createdBy");

-- CreateIndex
CREATE UNIQUE INDEX "Group_id_activityId_key" ON "Group"("id", "activityId");

-- CreateIndex
CREATE INDEX "GroupViewer_groupId_idx" ON "GroupViewer"("groupId");

-- CreateIndex
CREATE INDEX "Membership_groupId_idx" ON "Membership"("groupId");

-- CreateIndex
CREATE INDEX "Membership_userId_idx" ON "Membership"("userId");

-- CreateIndex
CREATE INDEX "Message_sentBy_idx" ON "Message"("sentBy");

-- CreateIndex
CREATE INDEX "Message_channelId_idx" ON "Message"("channelId");

-- CreateIndex
CREATE INDEX "PendingInvite_groupId_idx" ON "PendingInvite"("groupId");

-- CreateIndex
CREATE INDEX "Session_userId_idx" ON "Session"("userId");
