/*
  Warnings:

  - You are about to alter the column `balance` on the `users` table. The data in that column could be lost. The data in that column will be cast from `Money` to `Decimal`.

*/
-- AlterTable
ALTER TABLE "users" ALTER COLUMN "balance" SET DATA TYPE DECIMAL;
