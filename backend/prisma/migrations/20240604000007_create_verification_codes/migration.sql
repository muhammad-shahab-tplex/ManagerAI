-- CreateTable
CREATE TABLE "verification_codes" (
  "id" SERIAL NOT NULL,
  "email" VARCHAR(100) NOT NULL,
  "code" VARCHAR(10) NOT NULL,
  "type" VARCHAR(20) NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "expires_at" TIMESTAMP(3) NOT NULL,
  "user_id" INTEGER,

  CONSTRAINT "verification_codes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "verification_codes_email_idx" ON "verification_codes"("email");

-- CreateIndex
CREATE INDEX "verification_codes_code_idx" ON "verification_codes"("code");

-- AddForeignKey
ALTER TABLE "verification_codes" ADD CONSTRAINT "verification_codes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE; 