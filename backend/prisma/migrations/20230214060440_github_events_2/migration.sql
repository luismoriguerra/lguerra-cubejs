/*
  Warnings:

  - You are about to drop the column `extracolumn` on the `github_events` table. All the data in the column will be lost.
  - Added the required column `extra1` to the `github_events` table without a default value. This is not possible if the table is not empty.
  - Added the required column `extra2` to the `github_events` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "github_events" DROP COLUMN "extracolumn",
ADD COLUMN     "extra1" TEXT NOT NULL,
ADD COLUMN     "extra2" TEXT NOT NULL;
