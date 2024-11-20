-- DropIndex
DROP INDEX "donations_created_at_idx";

-- CreateIndex
CREATE INDEX "donations_updated_at_idx" ON "donations"("updated_at");
