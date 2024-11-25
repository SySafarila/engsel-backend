-- CreateTable
CREATE TABLE "Bank" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "bank" VARCHAR(100) NOT NULL,
    "number" BIGINT NOT NULL,
    "verified_at" TIMESTAMP(3),

    CONSTRAINT "Bank_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Bank_id_key" ON "Bank"("id");

-- AddForeignKey
ALTER TABLE "Bank" ADD CONSTRAINT "Bank_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
