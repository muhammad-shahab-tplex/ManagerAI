-- CreateTable
CREATE TABLE "user_preferences" (
  "id" SERIAL NOT NULL,
  "user_id" INTEGER NOT NULL,
  "email_frequency" VARCHAR(20) NOT NULL DEFAULT 'daily',
  "auto_reply_enabled" BOOLEAN NOT NULL DEFAULT false,
  "auto_reply_confidence_threshold" DOUBLE PRECISION NOT NULL DEFAULT 0.85,

  CONSTRAINT "user_preferences_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_preferences_user_id_key" ON "user_preferences"("user_id");

-- AddForeignKey
ALTER TABLE "user_preferences" ADD CONSTRAINT "user_preferences_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE; 