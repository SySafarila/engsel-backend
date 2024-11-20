/*
  Warnings:

  - Added the required column `provider` to the `donations` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "donations" ADD COLUMN     "provider" VARCHAR(50) NOT NULL;
