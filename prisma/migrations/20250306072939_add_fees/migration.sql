-- CreateTable
CREATE TABLE "donation_fees" (
    "id" UUID NOT NULL,
    "donation_id" UUID NOT NULL,
    "percentage" DECIMAL NOT NULL DEFAULT 0.7,
    "description" TEXT NOT NULL DEFAULT 'Payment Gateway Fee',
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "donation_fees_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "donation_fees_id_key" ON "donation_fees"("id");

-- AddForeignKey
ALTER TABLE "donation_fees" ADD CONSTRAINT "donation_fees_donation_id_fkey" FOREIGN KEY ("donation_id") REFERENCES "donations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
