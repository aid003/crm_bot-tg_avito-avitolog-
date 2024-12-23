/*
  Warnings:

  - You are about to drop the `MpatyPubAdv` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MpatyTelegram` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "MpatyPubAdv";

-- DropTable
DROP TABLE "MpatyTelegram";

-- CreateTable
CREATE TABLE "Users" (
    "id" SERIAL NOT NULL,
    "project" TEXT NOT NULL,
    "name" TEXT,
    "username" TEXT,
    "tgId" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'user',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_tgId_key" ON "Users"("tgId");
