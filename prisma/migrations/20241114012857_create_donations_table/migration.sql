-- CreateTable
CREATE TABLE "donations" (
    "id" UUID NOT NULL,
    "currency" VARCHAR(3) NOT NULL,
    "donator_name" VARCHAR(255) NOT NULL,
    "donator_email" VARCHAR(255),
    "message" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "payment_method" VARCHAR(50) NOT NULL,
    "tts" JSONB,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "donations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_DonationToUser" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "donations_id_key" ON "donations"("id");

-- CreateIndex
CREATE UNIQUE INDEX "_DonationToUser_AB_unique" ON "_DonationToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_DonationToUser_B_index" ON "_DonationToUser"("B");

-- AddForeignKey
ALTER TABLE "_DonationToUser" ADD CONSTRAINT "_DonationToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "donations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DonationToUser" ADD CONSTRAINT "_DonationToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
