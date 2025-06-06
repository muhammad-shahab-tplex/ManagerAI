-- CreateTable
CREATE TABLE "users" (
  "id" SERIAL NOT NULL,
  "name" VARCHAR(100) NOT NULL,
  "email" VARCHAR(100) NOT NULL,
  "password" VARCHAR(100) NOT NULL,
  "role" VARCHAR(20) NOT NULL DEFAULT 'user',
  "subscription_tier" VARCHAR(20) NOT NULL DEFAULT 'free',
  "google_id" VARCHAR(100),
  "microsoft_id" VARCHAR(100),
  "github_id" VARCHAR(100),
  "reset_password_token" VARCHAR(200),
  "reset_password_expire" TIMESTAMP(3),
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_google_id_idx" ON "users"("google_id");

-- CreateIndex
CREATE INDEX "users_github_id_idx" ON "users"("github_id");

-- CreateIndex
CREATE INDEX "users_microsoft_id_idx" ON "users"("microsoft_id"); 