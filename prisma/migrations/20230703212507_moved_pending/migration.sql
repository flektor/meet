/*
  Warnings:

  - You are about to drop the column `activityId` on the `PendingInvite` table. All the data in the column will be lost.
  - Added the required column `activityId` to the `Group` table without a default value. This is not possible if the table is not empty.
  - Added the required column `groupId` to the `PendingInvite` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "PendingInvite" DROP CONSTRAINT "PendingInvite_activityId_fkey";

-- AlterTable
ALTER TABLE "Group" ADD COLUMN     "activityId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "PendingInvite" DROP COLUMN "activityId",
ADD COLUMN     "groupId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Group" ADD CONSTRAINT "Group_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "Activity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PendingInvite" ADD CONSTRAINT "PendingInvite_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;
