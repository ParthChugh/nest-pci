/*
  Warnings:

  - You are about to drop the column `description` on the `favorites` table. All the data in the column will be lost.
  - You are about to drop the column `link` on the `favorites` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `favorites` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "favorites" DROP COLUMN "description",
DROP COLUMN "link",
DROP COLUMN "title",
ADD COLUMN     "userId" INTEGER;

-- AddForeignKey
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
