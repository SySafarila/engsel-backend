-- CreateTable
CREATE TABLE "tts" (
    "id" UUID NOT NULL,
    "text" TEXT NOT NULL,
    "is_female" BOOLEAN NOT NULL,
    "sound_type" SMALLINT NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tts_id_key" ON "tts"("id");

-- CreateIndex
CREATE INDEX "tts_text_idx" ON "tts"("text");
