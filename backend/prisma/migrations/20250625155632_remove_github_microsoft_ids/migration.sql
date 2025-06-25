/*
  Warnings:

  - You are about to drop the column `github_id` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `microsoft_id` on the `users` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "users_github_id_idx";

-- DropIndex
DROP INDEX "users_microsoft_id_idx";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "github_id",
DROP COLUMN "microsoft_id";
