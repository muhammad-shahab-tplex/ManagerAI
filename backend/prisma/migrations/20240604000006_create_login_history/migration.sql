-- CreateTable
CREATE TABLE "login_history" (
  "id" SERIAL NOT NULL,
  "user_id" INTEGER NOT NULL,
  "ip_address" VARCHAR(50) NOT NULL,
  "user_agent" VARCHAR(200) NOT NULL,
  "login_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "success" BOOLEAN NOT NULL DEFAULT true,

  CONSTRAINT "login_history_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "login_history_user_id_idx" ON "login_history"("user_id");

-- CreateIndex
CREATE INDEX "login_history_login_time_idx" ON "login_history"("login_time");

-- AddForeignKey
ALTER TABLE "login_history" ADD CONSTRAINT "login_history_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE; 