/*
  Warnings:

  - You are about to drop the `Bank` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Bank" DROP CONSTRAINT "Bank_user_id_fkey";

-- DropTable
DROP TABLE "Bank";

-- CreateTable
CREATE TABLE "banks" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "bank" VARCHAR(100) NOT NULL,
    "number" BIGINT NOT NULL,
    "verified_at" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "banks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "banks_id_key" ON "banks"("id");

-- CreateIndex
CREATE INDEX "banks_created_at_idx" ON "banks"("created_at");

-- AddForeignKey
ALTER TABLE "banks" ADD CONSTRAINT "banks_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
