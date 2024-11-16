-- AlterTable
ALTER TABLE "donations" ADD COLUMN     "qris_image" TEXT,
ADD COLUMN     "virtual_account_bank" VARCHAR(50),
ADD COLUMN     "virtual_account_number" VARCHAR(100);
