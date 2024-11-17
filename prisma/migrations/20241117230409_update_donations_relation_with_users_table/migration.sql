/*
  Warnings:

  - You are about to drop the `_DonationToUser` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `user_id` to the `donations` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_DonationToUser" DROP CONSTRAINT "_DonationToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_DonationToUser" DROP CONSTRAINT "_DonationToUser_B_fkey";

-- AlterTable
ALTER TABLE "donations" ADD COLUMN     "user_id" UUID NOT NULL;

-- DropTable
DROP TABLE "_DonationToUser";

-- AddForeignKey
ALTER TABLE "donations" ADD CONSTRAINT "donations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
