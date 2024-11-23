-- DropForeignKey
ALTER TABLE "withdraws" DROP CONSTRAINT "withdraws_user_id_fkey";

-- AddForeignKey
ALTER TABLE "withdraws" ADD CONSTRAINT "withdraws_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
