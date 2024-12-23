-- CreateTable
CREATE TABLE "MpatyPubAdv" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "username" TEXT,
    "tgId" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'user',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MpatyPubAdv_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MpatyPubAdv_tgId_key" ON "MpatyPubAdv"("tgId");
