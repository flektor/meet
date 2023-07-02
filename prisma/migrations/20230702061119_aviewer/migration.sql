-- CreateTable
CREATE TABLE "ActivityViewer" (
    "userId" TEXT NOT NULL,
    "activityId" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "ActivityViewer_userId_activityId_key" ON "ActivityViewer"("userId", "activityId");

-- AddForeignKey
ALTER TABLE "ActivityViewer" ADD CONSTRAINT "ActivityViewer_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "Activity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityViewer" ADD CONSTRAINT "ActivityViewer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
