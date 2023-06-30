-- CreateTable
CREATE TABLE "Registrations" (
    "userId" TEXT NOT NULL,
    "activityId" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Registrations_userId_activityId_key" ON "Registrations"("userId", "activityId");

-- AddForeignKey
ALTER TABLE "Registrations" ADD CONSTRAINT "Registrations_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "Activity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Registrations" ADD CONSTRAINT "Registrations_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
