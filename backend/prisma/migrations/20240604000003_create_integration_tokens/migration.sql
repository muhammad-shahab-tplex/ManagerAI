-- CreateTable
CREATE TABLE "integration_tokens" (
  "id" SERIAL NOT NULL,
  "user_id" INTEGER NOT NULL,
  "service" VARCHAR(50) NOT NULL,
  "access_token" VARCHAR(1000) NOT NULL,
  "refresh_token" VARCHAR(1000),
  "expiry" TIMESTAMP(3),

  CONSTRAINT "integration_tokens_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "integration_tokens" ADD CONSTRAINT "integration_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE; 