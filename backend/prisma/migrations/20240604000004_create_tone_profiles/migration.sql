-- CreateTable
CREATE TABLE "tone_profiles" (
  "id" SERIAL NOT NULL,
  "user_id" INTEGER NOT NULL,
  "formal" DOUBLE PRECISION NOT NULL DEFAULT 0.5,
  "friendly" DOUBLE PRECISION NOT NULL DEFAULT 0.5,
  "technical" DOUBLE PRECISION NOT NULL DEFAULT 0.5,
  "simple" DOUBLE PRECISION NOT NULL DEFAULT 0.5,
  "confident" DOUBLE PRECISION NOT NULL DEFAULT 0.5,

  CONSTRAINT "tone_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tone_profiles_user_id_key" ON "tone_profiles"("user_id");

-- AddForeignKey
ALTER TABLE "tone_profiles" ADD CONSTRAINT "tone_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE; 