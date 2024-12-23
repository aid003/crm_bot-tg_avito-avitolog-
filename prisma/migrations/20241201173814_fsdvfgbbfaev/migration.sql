/*
  Warnings:

  - A unique constraint covering the columns `[tgId]` on the table `Users` will be added. If there are existing duplicate values, this will fail.
  - Made the column `tgId` on table `Users` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Users" ALTER COLUMN "tgId" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Users_tgId_key" ON "Users"("tgId");
