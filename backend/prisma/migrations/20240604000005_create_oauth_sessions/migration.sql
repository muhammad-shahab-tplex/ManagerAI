-- CreateTable
CREATE TABLE "oauth_sessions" (
  "id" SERIAL NOT NULL,
  "user_id" INTEGER NOT NULL,
  "provider" VARCHAR(20) NOT NULL,
  "state_token" VARCHAR(100) NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "oauth_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "oauth_sessions_user_id_idx" ON "oauth_sessions"("user_id");

-- CreateIndex
CREATE INDEX "oauth_sessions_state_token_idx" ON "oauth_sessions"("state_token");

-- AddForeignKey
ALTER TABLE "oauth_sessions" ADD CONSTRAINT "oauth_sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE; 