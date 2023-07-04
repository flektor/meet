/*
  Warnings:

  - A unique constraint covering the columns `[id,activityId]` on the table `Group` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Group_id_activityId_key" ON "Group"("id", "activityId");
