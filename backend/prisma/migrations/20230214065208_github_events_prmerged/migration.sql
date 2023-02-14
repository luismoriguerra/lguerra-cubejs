/*
  Warnings:

  - The `pr_merged` column on the `github_events` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "github_events" DROP COLUMN "pr_merged",
ADD COLUMN     "pr_merged" INTEGER;
