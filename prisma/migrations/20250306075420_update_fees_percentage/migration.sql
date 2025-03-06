/*
  Warnings:

  - You are about to alter the column `percentage` on the `donation_fees` table. The data in that column could be lost. The data in that column will be cast from `Decimal` to `DoublePrecision`.

*/
-- AlterTable
ALTER TABLE "donation_fees" ALTER COLUMN "percentage" SET DATA TYPE DOUBLE PRECISION;
