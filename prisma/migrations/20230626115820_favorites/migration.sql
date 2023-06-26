-- CreateTable
CREATE TABLE "Favorites" (
    "userId" TEXT NOT NULL,
    "activityId" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Favorites_userId_activityId_key" ON "Favorites"("userId", "activityId");

-- AddForeignKey
ALTER TABLE "Favorites" ADD CONSTRAINT "Favorites_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "Activity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Favorites" ADD CONSTRAINT "Favorites_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
