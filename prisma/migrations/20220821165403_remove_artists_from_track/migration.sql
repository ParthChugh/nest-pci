/*
  Warnings:

  - You are about to drop the column `artistId` on the `tracks` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "tracks" DROP CONSTRAINT "tracks_artistId_fkey";

-- AlterTable
ALTER TABLE "tracks" DROP COLUMN "artistId";
